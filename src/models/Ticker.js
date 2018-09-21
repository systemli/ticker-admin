import PropTypes from 'prop-types';

export default class Ticker {
    constructor(props) {
        if (undefined === props) {
            props = {
                information: {},
            };
        }

        this.id = undefined !== props.id ? props.id : null;
        this.title = undefined !== props.title ? props.title : null;
        this.domain = undefined !== props.domain ? props.domain : null;
        this.description = undefined !== props.description ? props.description : null;
        this.active = undefined !== props.active ? props.active : false;
        this.prepend_time = undefined !== props.prepend_time ? props.prepend_time : false;
        this.information = {
            author: undefined !== props.information.author ? props.information.author : null,
            url: undefined !== props.information.url ? props.information.url : null,
            email: undefined !== props.information.email ? props.information.email : null,
            twitter: undefined !== props.information.twitter ? props.information.twitter : null,
            facebook: undefined !== props.information.facebook ? props.information.facebook : null,
        };
        this.twitter = {
            active: undefined !== props.twitter.active ? props.twitter.name : false,
            name: undefined !== props.twitter.name ? props.twitter.name : null,
            screen_name: undefined !== props.twitter.screen_name ? props.twitter.screen_name : null,
            description: undefined !== props.twitter.description ? props.twitter.description : null,
        }
    }
}

Ticker.propTypes = {
    id: PropTypes.number,
    title: PropTypes.string,
    domain: PropTypes.string,
    description: PropTypes.string,
    active: PropTypes.bool,
    prepend_time: PropTypes.bool,
    information: PropTypes.shape({
        author: PropTypes.string,
        url: PropTypes.string,
        email: PropTypes.string,
        twitter: PropTypes.string,
        facebook: PropTypes.string,
    }),
    twitter: PropTypes.shape({
        active: PropTypes.bool,
        name: PropTypes.string,
        screen_name: PropTypes.string,
        description: PropTypes.string,
    })
};
