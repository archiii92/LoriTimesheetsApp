import React, { Component, PropTypes } from 'react';
import { View, Text, TextInput, Image, Alert, Button, Switch, AsyncStorage } from 'react-native';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            saveData: false
        };
        this.controller = this.props.controller;

        this.quietLogIn();
    }

    quietLogIn = async () => {
        try {
            let username = await AsyncStorage.getItem('username');
            if (username !== null){
                let password = await AsyncStorage.getItem('password');
                this.state.username = username;
                this.state.password = password;
                await this.onLogIn();
                // For test
                //await AsyncStorage.removeItem('username');
                //await AsyncStorage.removeItem('password');
            }
        } catch (error) {
            Alert.alert('Ошибка!', 'Загрузка логина-пароля завершилось неудачей');
            console.error(error);
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
                        Lori Timesheets App
                    </Text>
                </View>
                <View style={{flex: 0, paddingTop: 10}}>
                    <TextInput
                        placeholder="Введите логин"
                        secureTextEntry={true}
                        onChangeText={(username) => this.setState({username})}
                        style={{height: 70}}
                    />
                    <TextInput
                        placeholder="Введите пароль"
                        secureTextEntry={true}
                        onChangeText={(password) => this.setState({password})}
                        style={{height: 70}}
                    />
                </View>
                <View style={{flex: 0, paddingTop: 10, flexDirection: 'row'}}>
                    <Text style={{paddingLeft: 10, paddingTop: 4, paddingRight: 10}}>
                        Запомнить логин/пароль
                    </Text>
                    <Switch
                        onValueChange={(value) => this.setState({saveData: value})}
                        value={this.state.saveData}
                    />
                </View>
                <View style={{flex: 0, paddingTop: 15}}>
                    <Button
                        onPress={this.onLogIn}
                        title="Войти"
                        color="#841584"
                        style={{height: 100}}
                    />
                </View>
            </View>
        )
    }

    onLogIn = async () => {
        let rez = await this.controller.logIn(this.state.username, this.state.password);
        if (rez) {
            if (this.state.saveData) {
                try {
                    await AsyncStorage.setItem('username', this.state.username);
                    await AsyncStorage.setItem('password', this.state.password);
                } catch (error) {
                    Alert.alert('Ошибка!', 'Сохранение логина-пароля завершилось неудачей');
                    console.error(error);
                }
            }
            this.props.onForward();
        }
    };
}

 Login.propTypes = {
    onForward: PropTypes.func.isRequired
};
