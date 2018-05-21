import React, {Component} from 'react';
import AuthService from './AuthService';
import {ApiUrl} from "../api/Api";
import {withRouter} from "react-router-dom";

export default function withAuth(AuthComponent) {
    const Auth = new AuthService(ApiUrl);

    return withRouter(class AuthWrapped extends Component {
        constructor(props) {
            super(props);
            this.state = {
                user: null
            }
        }

        componentWillMount() {
            if (!Auth.loggedIn()) {
                this.props.history.replace('/login');
            }
            else {
                try {
                    const profile = Auth.getProfile();

                    Auth.fetch(`${ApiUrl}/admin/users/${profile.id}`).then(response => {
                        this.setState({
                            user: response.data.user,
                        });
                    });
                }
                catch (err) {
                    Auth.logout();
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
