import { Alert } from 'react-native';

export default class Controller{
    constructor(store){
        this.store = store;

        this.host = '192.168.56.1';
        //this.host = '192.168.43.84';
        //this.host = '10.60.5.78';
    }

    logIn = async (username, password) => {
        try {
            let response = await fetch('http://'+this.host+':8080/app/dispatch/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                    locale : "en"
                })
            });

            if (response.ok ){
                this.store.userSessionId = await response.text();
                await this.getUser(username);
                return true;
            } else if (response.status === 401 ){
                Alert.alert('Ошибка!', 'Неверный логин-пароль!');
                return false;
            }
        }
        catch(error) {
            console.error(error);
            Alert.alert('Ошибка!', 'Отсутствует соединение с сетью, либо сервер Lori Timesheets не отвечает!');
            return false;
        }
    };

    getTimesheets = async () => {
        try {
            let correctFirstDay = this.store.firstDay.getFullYear() + '-' + (this.store.firstDay.getMonth() + 1) + '-' + this.store.firstDay.getDate();
            let correctLastDay = this.store.lastDay.getFullYear() + '-' + (this.store.lastDay.getMonth() + 1) + '-' + this.store.lastDay.getDate();

            let response = await fetch("http://"+this.host+":8080/app/dispatch/api/query.json?s="+ this.store.userSessionId+"&e=ts$TimeEntry&view=timeEntry-browse&q=select+t+from+ts$TimeEntry+t+where+t.date+between+'"+ correctFirstDay +"'+and+'"+ correctLastDay +"'order+by+t.date+desc", {
                method: 'GET'
            });

            if (response.ok ){
                this.store.timeSheets = await response.json();
            } else if (response.status === 401 ){
                Alert.alert('Ошибка!', 'Недостаточно прав для получения сущностей ts$TimeEntry!');
            } else console.error(response);

        }
        catch(error) {
            console.error(error);
            Alert.alert('Ошибка!', 'Отсутствует соединение с сетью, либо сервер Lori Timesheets не отвечает!');
        }
    };

    getProjectsWithTasks = async () => {
        try {
            let response = await fetch('http:/'+this.host+':8080/app/dispatch/api/query.json?s='+ this.store.userSessionId+'&e=ts$Project&view=project-full&q=select+p+from+ts$Project+p+order+by+p.name+asc', {
                method: 'GET'
            });

            if (response.ok ){
                this.store.projectsWithTasks = await response.json();
            } else if (response.status === 401 ){
                Alert.alert('Ошибка!', 'Недостаточно прав для получения сущностей ts$Project!');
            } else console.error(response);
        }
        catch(error) {
            console.error(error);
            Alert.alert('Ошибка!', 'Отсутствует соединение с сетью, либо сервер Lori Timesheets не отвечает!');
        }
    };

    deleteTimesheet = async () => {
        try {
            let response = await fetch('http://'+this.host+':8080/app/dispatch/api/commit?s='+ this.store.userSessionId, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    removeInstances: [
                        {
                            id: this.store.selectedTimesheet.id
                        }
                    ],
                    softDeletion: true
                })
            });

            if (response.ok ){
                await this.getTimesheets();
                this.store.updateList = true;
                this.store.timesheetsList.setWeekPanelState(this.store.firstDay, this.store.lastDay);
            } else if (response.status === 401 ){
                Alert.alert('Ошибка!', 'Недостаточно прав для удаления сущностей ts$TimeEntry!');
            } else console.error(response);

        }
        catch(error) {
            console.error(error);
            Alert.alert('Ошибка!', 'Отсутствует соединение с сетью, либо сервер Lori Timesheets не отвечает!');
        }
    };

    addTimesheet = async (newTimesheet) => {
        newTimesheet.user = {
            id: this.store.user.id
        };

        try {
            let response = await fetch('http://'+this.host+':8080/app/dispatch/api/commit?s='+ this.store.userSessionId, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    commitInstances: [
                        newTimesheet
                    ]
                })
            });

            if (response.ok ){
                await this.getTimesheets();
                this.store.updateList = true;
                this.store.timesheetsList.setWeekPanelState(this.store.firstDay, this.store.lastDay);
            } else if (response.status === 401 ){
                Alert.alert('Ошибка!', 'Недостаточно прав для создания сущностей ts$TimeEntry!');
            } else console.error(response);

        }
        catch(error) {
            console.error(error);
            Alert.alert('Ошибка!', 'Отсутствует соединение с сетью, либо сервер Lori Timesheets не отвечает!');
        }
    };

    getUser = async (username) => {
        try {
            let response = await fetch('http://'+this.host+':8080/app/dispatch/api/query.json?s=' + this.store.userSessionId, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    entity: "ts$ExtUser",
                    query: "select c from ts$ExtUser c where c.login = '"+ username +"'"
                })
            });

            if (response.ok) {
                let users = await response.json();
                this.store.user = users[0];
            } else if (response.status === 401) {
                Alert.alert('Ошибка!', 'Недостаточно прав для получения сущностей ts$ExtUser!');
            } else console.error(response);

        }
        catch (error) {
            console.error(error);
            Alert.alert('Ошибка!', 'Отсутствует соединение с сетью, либо сервер Lori Timesheets не отвечает!');
        }
    };
}