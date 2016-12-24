import React, { Component, PropTypes } from 'react';
import { View, Text, ListView, Image, TouchableHighlight, DatePickerAndroid, StyleSheet, TouchableWithoutFeedback, Button, ScrollView } from 'react-native';

export default class MyTimesheetsList extends Component {
    constructor(props) {
        super(props);

        this.store = this.props.store;
        this.controller = this.props.controller;

        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        this.data = [];
        this.state = {
            dataSource: ds.cloneWithRows(this.data),
            currentDate: null,
            weekPanelText: ''
        };

        this.store.timesheetsList = this;
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
                        Мои записи времени
                    </Text>
                </View>
                <View style={{flex: 0, paddingTop: 10}}>
                    <TouchableWithoutFeedback
                        onPress={
                            this.showPicker.bind(this, 'preset', {date: this.state.currentDate})
                        }
                    >
                        <View>
                            <Text
                            style={styles.text}
                            >
                            {this.state.weekPanelText}
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <View style={{flex: 0, paddingTop: 10}}>
                    <Button
                        onPress={this.onAdd}
                        title="Добавить +"
                        color="#841584"
                        style={{height: 100}}
                    />
                </View>
                <View style={{flex: 0, paddingTop: 10}}>
                    <ListView
                        dataSource={this.state.dataSource}
                        renderRow={this.renderRow}
                        renderScrollComponent={props => <ScrollView  {...props} />}
                        renderSeparator={this.renderSeparator}
                    />
                </View>
            </View>
        )
    }

    componentDidMount(){
        this.setWeekPanelState(new Date);
    }

    showPicker = async (stateKey, options) => {
        try {
            const {action, year, month, day} = await DatePickerAndroid.open(options);
            if (action === DatePickerAndroid.dismissedAction) {
            } else {
                this.setWeekPanelState(new Date(year, month, day));
            }
        }
        catch ({code, message}) {
            console.warn(`Error in example '${stateKey}': `, message);
        }
    };

    setWeekPanelState = (date) => {
        let first = date.getDate() - date.getDay();

        let firstDay = new Date(date.setDate(first));
        let lastDay = new Date(date.setDate(first+6));

        this.setState({currentDate: date, weekPanelText: 'С '+ firstDay.toLocaleDateString() + ' по ' + lastDay.toLocaleDateString()});

        this.setTimesheetsList(firstDay, lastDay);
    };

    setTimesheetsList = async (firstDay, lastDay) => {
        this.store.firstDay = firstDay;
        this.store.lastDay = lastDay;
        await this.controller.getTimesheets();
        this.data = this.store.timeSheets;
        this.setState({ dataSource: this.state.dataSource.cloneWithRows(this.data) });
    };

    selectedRow = (rowID) => {
        this.store.selectedTimesheet = this.store.timeSheets[rowID];
    };

    renderRow = (rowData, sectionID, rowID, highlightRow) => {
        return (
            <TouchableHighlight
                onPress={() => {
                    this.selectedRow(rowID);
                    this.props.onForward();
                }}
            >
                <View
                    style={styles.row}
                >
                    <View
                        style={styles.column}
                    >
                    <Text
                        style={styles.taskName}
                    >
                        {rowData.taskName}
                    </Text>
                    <Text
                        style={styles.taskStatus}
                    >
                        Статус: {rowData.status}
                    </Text>
                    <Text
                        style={styles.taskDate}
                    >
                        Создана: {rowData.date}
                    </Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    };

    renderSeparator = (sectionID, rowID, adjacentRowHighlighted) => {
        return (
            <View
                key={`${sectionID}-${rowID}`}
                style={{ height: adjacentRowHighlighted ? 4 : 1, backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC', }}
            />
        );
    };

    onAdd = () => {
        this.store.selectedTimesheet = null;
        this.props.onForward();
    }
}

let styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        //justifyContent: 'center',
        padding: 10,
        backgroundColor: '#F6F6F6',
    },
    column: {
        flexDirection: 'column'
    },
    text: {
        color: 'black',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold'
    },
    taskName: {
        color: 'black',
        textAlign: 'left',
        fontSize: 18
    },
    taskStatus: {
        color: 'black',
        textAlign: 'left',
        fontSize: 17
    }
});

MyTimesheetsList.propTypes = {
    onForward: PropTypes.func.isRequired
};