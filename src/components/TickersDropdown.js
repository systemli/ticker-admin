import React from "react";
import {Dropdown} from "semantic-ui-react";
import withAuth from "./withAuth";
import {getTickers} from "../api/Ticker";

class TickersDropdown extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tickers: [],
        };
    }

    componentDidMount() {
        getTickers().then(response => {
            let options = [];
            response.data.tickers.map(ticker => {
                return options.push({key: ticker.id, text: ticker.title, value: ticker.id});
            });

            this.setState({tickers: options});
        });
    }

    render() {
        const options = this.state.tickers;

        return (
            <Dropdown
                fluid multiple selection
                options={options}
                placeholder={this.props.placeholder}
                onChange={this.props.onChange}
                defaultValue={this.props.defaultValue}
            />
        );
    }
}

export default withAuth(TickersDropdown);
