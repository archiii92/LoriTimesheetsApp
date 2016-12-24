import React, { Component, PropTypes } from 'react';
import { View, Text, TextInput, Image, Button, Picker, DatePickerAndroid, TouchableWithoutFeedback } from 'react-native';

let PickerItem = Picker.Item;

export default class NewTimesheet extends Component {
    constructor(props) {
        super(props);

        this.controller = this.props.controller;
        this.store = this.props.store;

        this.defaultProjectPickerState = {
            selectedProject: "defaultKey",
            projects: [{value: "defaultKey", label: "Отстутствуют проекты, участником которых вы являетесь"}],
            enableProjectPicker: false
        };

        this.defaultTaskPickerState = {
            selectedTask: "defaultKey",
            tasks: [{value: "defaultKey", label: "Отстутствуют задачи у выбранного проекта"}],
            enableTaskPicker: false
        };

        this.state = {
            selectedProject: this.defaultProjectPickerState.selectedProject,
            projects: this.defaultProjectPickerState.projects,
            enableProjectPicker: this.defaultProjectPickerState.enableProjectPicker,
            selectedTask: this.defaultTaskPickerState.selectedTask,
            tasks: this.defaultTaskPickerState.tasks,
            enableTaskPicker: this.defaultTaskPickerState.enableTaskPicker,
            date: new Date(),
            spentTime: 0,
            createButtonDisable: true
        };
    }

    componentDidMount = () => {
        this.setProjectPickerState();
    };

    setProjectPickerState = async () => {
        await this.controller.getProjectsWithTasks();

        if (this.store.projectsWithTasks.length > 0) {
            let enableProjectPicker = true;
            let selectedProject = this.store.projectsWithTasks[0].id;
            let projects = [];

            this.store.projectsWithTasks.forEach((project) => {
                projects.push({value: project.id, label: project.name});
            });

            this.setState({selectedProject, projects, enableProjectPicker});

            this.store.selectedProject = this.store.projectsWithTasks[0];

            this.setTaskPickerState();
        }
    };

    setTaskPickerState = () => {
        if (this.store.selectedProject.tasks.length > 0) {
            let enableTaskPicker = true;
            let selectedTask = this.store.selectedProject.tasks[0].id;
            let tasks = [];

            this.store.selectedProject.tasks.forEach((task) => {
                tasks.push({value: task.id, label: task.name});
            });

            this.setState({selectedTask, tasks, enableTaskPicker});

            this.store.selectedTask = this.store.selectedProject.tasks[0];
        } else {
            this.setState(this.defaultTaskPickerState);
        }
    };

    onProjectSelect = (project, itemPosition) => {
        this.setState({selectedProject: project});
        this.store.selectedProject = this.store.projectsWithTasks[itemPosition];
        this.setTaskPickerState();
    };

    onTaskSelect = (task, itemPosition) => {
        this.setState({selectedTask: task});
        this.store.selectedTask = this.store.selectedProject.tasks[itemPosition];
    };

    showPicker = async (stateKey, options) => {
        try {
            const {action, year, month, day} = await DatePickerAndroid.open(options);
            if (action === DatePickerAndroid.dismissedAction) {
            } else {
                this.setState({date: new Date(year, month, day)});
            }
        }
        catch ({code, message}) {
            console.warn(`Error in example '${stateKey}': `, message);
        }
    };

    render() {
        return (
            <View style={{flex: 1}}>
                <View style={{flex: 0, backgroundColor: '#1c1e20', flexDirection: 'row'}}>
                    <Image
                        source={require('./images/app-icon-menu.png')}
                        style={{width: 40, height: 40}}
                    />
                    <Text style={{color: 'white', paddingLeft: 60, paddingTop: 10, fontSize: 20}}>
                        Создание новой записи времени
                    </Text>
                </View>
                <View style={{flex: 0, paddingTop: 10}}>
                    <Text style={{paddingLeft: 10}}>
                        Выберите проект из списка:
                    </Text>
                    <Picker
                        selectedValue={this.state.selectedProject}
                        onValueChange={(project, itemPosition) => this.onProjectSelect(project, itemPosition)}
                        prompt="Выберите проект из списка"
                        enabled={this.state.enableProjectPicker}>
                        { this.state.projects.map((s, i) => {
                            return <PickerItem
                                key={i}
                                value={s.value}
                                label={s.label} />
                        }) }
                    </Picker>
                </View>
                <View style={{flex: 0, paddingTop: 10}}>
                    <Text style={{paddingLeft: 10}}>
                        Выберите задачу из списка:
                    </Text>
                    <Picker
                        selectedValue={this.state.selectedTask}
                        onValueChange={(task, itemPosition) => this.onTaskSelect(task, itemPosition)}
                        prompt="Выберите задачу из списка"
                        enabled={this.state.enableTaskPicker}>
                        { this.state.tasks.map((s, i) => {
                            return <PickerItem
                                key={i}
                                value={s.value}
                                label={s.label} />
                        }) }
                    </Picker>
                </View>
                <View style={{flex: 0, paddingTop: 15}}>
                    <TouchableWithoutFeedback
                        onPress={
                            this.showPicker.bind(this, 'preset', {date: this.state.date})
                        }
                    >
                        <View>
                            <Text style={{paddingLeft: 10}}>
                                Дата: {this.state.date.toLocaleDateString()}
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <View style={{flex: 0, paddingTop: 5}}>
                    <TextInput
                        placeholder="Введите затраченное время в минутах"
                        secureTextEntry={false}
                        onChangeText={(spentTime) => this.onTextInput(spentTime)}
                    />
                </View>
                <View style={{flex: 0, paddingTop: 10}}>
                    <Button
                        onPress={this.onCreate}
                        disabled={this.state.createButtonDisable}
                        title="Создать"
                        color="#841584"
                        style={{height: 100}}
                    />
                </View>
                <View style={{flex: 0, paddingTop: 10}}>
                    <Button
                        onPress={this.onBack}
                        title="Отмена"
                        color="#841584"
                        style={{height: 100}}
                    />
                </View>
            </View>
        )
    }

    onTextInput = (spentTime) => {
        if (spentTime!='' && !isNaN(spentTime) && (+spentTime)!=0){
            this.setState({spentTime});
            this.setState({createButtonDisable: false});
        } else {
            this.setState({createButtonDisable: true});
        }
    };

    onBack = () => {
        this.props.onBack();
    };

    onCreate = () => {
        let newTimesheet = {
            id: "NEW-ts$TimeEntry",
            task: {
                id: this.store.selectedTask.id
            },
            date: this.state.date,
            timeInMinutes: this.state.spentTime
        };

        this.controller.addTimesheet(newTimesheet);
        this.props.onBack();
    };
}

NewTimesheet.propTypes = {
    onBack: PropTypes.func.isRequired
};