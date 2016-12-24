import React, { Component } from 'react';

export default class Store{
    constructor(props) {
        this.userSessionId = '';
        this.timeSheets = [];
        this.selectedTimesheet = null;
        this.selectedProject = null;
        this.selectedTask = null;
        this.projectsWithTasks = [];
        this.user = null;
        this.firstDay = null;
        this.lastDay = null;
        this.timesheetsList = null;
    }
}