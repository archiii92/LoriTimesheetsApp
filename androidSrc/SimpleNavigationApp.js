import React, { Component } from 'react';
import { AppRegistry, Navigator, Text, ToolbarAndroid, Image } from 'react-native';

import Login from './Login';
import MyTimesheetsList from './MyTimesheetsList';
import TimesheetInfo from './TimesheetInfo';
import NewTimesheet from './NewTimesheet';

import controller from './Controller'
import store from './Store'

export default class SimpleNavigationApp extends Component {
    constructor(props){
        super(props);

        this.store = new store();
        this.controller = new controller(this.store);
    }
    render() {
        const routes = [
            {index: 0},
            {index: 1},
            {index: 2}
        ];

        return (
            <Navigator
                initialRoute={routes[0]}
                renderScene={(route, navigator) => {

                    if (route.index == 0) {
                        return <Login
                            controller = {this.controller}
                            onForward={() => {
                                navigator.push(routes[1]);
                            }}
                        />
                    }

                    if (route.index == 1) {
                        return <MyTimesheetsList
                            controller = {this.controller}
                            store = {this.store}
                            onForward={() => {
                                navigator.push(routes[2]);
                            }}
                        />
                    }

                    if (route.index == 2) {
                        if (this.store.selectedTimesheet != null) {
                            return <TimesheetInfo
                                controller={this.controller}
                                store={this.store}
                                onBack={() => {
                                    navigator.pop();
                                }}
                            />
                        } else {
                            return <NewTimesheet
                                controller={this.controller}
                                store={this.store}
                                onBack={() => {
                                    navigator.pop();
                                }}
                            />
                        }
                    }

                }
                }
            />
        )
    }
};