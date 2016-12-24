import React, { Component, PropTypes } from 'react';
import { View, Text, TextInput, Image, Alert, Button, StyleSheet } from 'react-native';

export default class TimesheetInfo extends Component {
    constructor(props) {
        super(props);

        this.controller = this.props.controller;
        this.store = this.props.store;
        this.timesheet = this.store.selectedTimesheet;
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <View style={{flex: 0, backgroundColor: '#1c1e20', flexDirection: 'row'}}>
                    <Image
                        source={require('./images/app-icon-menu.png')}
                        style={{width: 40, height: 40}}
                    />
                    <Text style={{color: 'white', paddingLeft: 60, paddingTop: 10, fontSize: 20}}>
                         Просмотр информации о записи времени
                     </Text>
                </View>
                <View style={{flex: 0, paddingTop: 5}}>
                    <Text style={styles.text}>
                        Проект : {this.timesheet.task.project.name}
                    </Text>
                    <Text style={styles.text}>
                        Задача : {this.timesheet.task.name}
                    </Text>
                    <Text style={styles.text}>
                        Статус : {this.timesheet.status}
                    </Text>
                    <Text style={styles.text}>
                        Затраченное время : {this.timesheet.timeInHours} ч.
                    </Text>
                    <Text style={styles.text}>
                        Дата : {this.timesheet.date}
                    </Text>
                </View>
                <View style={{flex: 0, paddingTop: 15}}>
                    <Button
                        onPress={this.onDelete}
                        title="Удалить"
                        color="#841584"
                        style={{height: 100}}
                    />
                </View>
                <View style={{flex: 0, paddingTop: 10}}>
                    <Button
                        onPress={this.onBack}
                        title="Назад"
                        color="#841584"
                        style={{height: 100}}
                    />
                </View>
            </View>
        )
    }

    onBack = () => {
        this.props.onBack();
    };


    onDelete = async () => {
        await this.controller.deleteTimesheet();
        this.props.onBack();
    };
}

let styles = StyleSheet.create({
    text: {
        fontSize: 16,
        paddingLeft: 10,
        paddingTop: 10,
    }
});

TimesheetInfo.propTypes = {
    onBack: PropTypes.func.isRequired
};
