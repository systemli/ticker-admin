import React, {Component} from 'react';
import {ApiUrl} from "../api/Api";
import {withRouter} from "react-router-dom";
import AuthSingleton from "./AuthService";

export default function withAuth(AuthComponent) {
    const Auth = AuthSingleton.getInstance();

    return withRouter(class AuthWrapped extends Component {
        constructor(props) {
            super(props);

            this.state = {
                user: null,
            };
        }

        componentDidMount() {
            if (!Auth.loggedIn()) {
                this.props.history.replace('/login');
            }
            else {
                try {
                    const profile = Auth.getProfile();

                    Auth.fetch(`${ApiUrl}/admin/users/${profile.id}`, {}).then(response => {
                        this.setState({
                            user: response.data.user,
                        });
                    });
                }
                catch (err) {
                    Auth.removeToken();
                    this.props.history.replace('/login');
                }
            }
        }

        render() {
            if (this.state.user) {
                return (
                    <AuthComponent history={this.props.history} user={this.state.user} {...this.props} />
                );
            }
            else {
                return null;
            }
        }
    });
}
