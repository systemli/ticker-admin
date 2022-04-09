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

        if (undefined !== props.information) {
            this.information = {
                author: undefined !== props.information.author ? props.information.author : null,
                url: undefined !== props.information.url ? props.information.url : null,
                email: undefined !== props.information.email ? props.information.email : null,
                twitter: undefined !== props.information.twitter ? props.information.twitter : null,
                facebook: undefined !== props.information.facebook ? props.information.facebook : null,
            };
        } else {
            this.information = {
                author: '',
                url: '',
                email: '',
                twitter: '',
                facebook: '',
            }
        }

        if (undefined !== props.location) {
            this.location = {
                lat: undefined !== props.location.lat ? props.location.lat : 0.0,
                lon: undefined !== props.location.lon ? props.location.lon : 0.0,
            }
        } else {
            this.location = {
                lat: 0.0,
                lon: 0.0,
            }
        }

        if (undefined !== props.twitter) {
            this.twitter = {
                active: undefined !== props.twitter.active ? props.twitter.name : false,
                name: undefined !== props.twitter.name ? props.twitter.name : null,
                screen_name: undefined !== props.twitter.screen_name ? props.twitter.screen_name : null,
                description: undefined !== props.twitter.description ? props.twitter.description : null,
            }
        } else {
            this.twitter = {
                active: false,
                name: '',
                screen_name: '',
                description: '',
            }
        }
    }
}

Ticker.propTypes = {
    id: PropTypes.number,
    title: PropTypes.string,
    domain: PropTypes.string,
    description: PropTypes.string,
    active: PropTypes.bool,
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
