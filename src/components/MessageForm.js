import React from "react";
import {postMessage} from "../api/Message";
import PropTypes from "prop-types";
import {Button, Form, Image, Label, Loader, Message as Error} from "semantic-ui-react";
import {postUpload} from "../api/Upload";
import EditMapModal from "./EditMapModal";

const initialState = {
    message: '',
    counter: 0,
    counterColor: 'green',
    geoInformation: {},
    attachments: [],
    attachmentPreviews: 0,
    showEditMapModal: false,
    formError: false,
    formErrorMessage: '',
};

export default class MessageForm extends React.Component {
    constructor(props) {
        super(props);

        this.fileInputRef = React.createRef();

        this.state = initialState;
    }

    counterLimit() {
        return this.props.ticker.prepend_time ? 274 : 280
    }

    handleInput(event, input) {
        let color;
        let errorMessage = '';
        let error = false;

        //TODO: Calculate length for Twitter (cutting links to 20 characters)
        if (input.value.length > this.counterLimit()) {
            color = 'red';
            errorMessage = `The message is too long. You must remove ${input.value.length - this.counterLimit()} characters.`;
            error = true;
        } else if (input.value.length >= 260) {
            color = 'orange';
        } else if (input.value.length >= 220) {
            color = 'yellow';
        } else {
            color = 'green';
        }

        this.setState({
            message: input.value,
            counter: input.value.length,
            counterColor: color,
            formError: error,
            formErrorMessage: errorMessage,
        });
    }

    submitMessage() {
        let message = this.state.message, id = this.props.ticker.id, geoInformation = this.state.geoInformation,
            attachments = [];
        const {length} = message;
        if (length === 0 || length > this.counterLimit()) {
            return;
        }

        if (this.state.attachments.length > 0) {
            attachments = this.state.attachments.map((attachment) => attachment.id)
        }

        postMessage(id, message, geoInformation, attachments).then(response => {
            if (response.data !== undefined && response.data.message !== undefined) {
                this.setState(initialState);
                this.props.callback();
            }
        });
    }

    uploadAttachment(e) {
        e.preventDefault();

        const formData = new FormData();
        for (let i = 0; i < e.target.files.length; i++) {
            formData.append("files", e.target.files[i]);
        }
        this.setState({attachmentPreviews: e.target.files.length});
        formData.append("ticker", this.props.ticker.id);

        postUpload(formData).then(response => {
            const attachments = this.state.attachments;
            this.setState({attachments: attachments.concat(response.data.uploads), attachmentPreviews: 0});
        });

    }

    renderAttachmentPreviews() {
        if (this.state.attachmentPreviews === 0) {
            return null;
        }

        let images = [];

        for (let i = 0; i < this.state.attachmentPreviews; i++) {
            images[i] = <div style={{display: 'inline-block', position: 'relative', width: 150, height: 150}}>
                <Loader active/>
            </div>
        }

        return (
            <div>{images}</div>
        )
    }

    renderAttachments() {
        let attachments = this.state.attachments;

        if (attachments.length === 0) {
            return null;
        }

        const images = attachments.map((image, key) =>
            <div key={key} style={{display: 'inline-block', position: 'relative'}}>
                <Image
                    src={image.url} bordered
                    style={{width: 150, height: 150, objectFit: 'cover'}}
                />
                <Button
                    icon='delete' color='black' size='mini' circular compact
                    style={{position: 'absolute', right: 5, top: 5}}
                    onClick={() => {
                        delete attachments[key];

                        this.setState({attachments: attachments})
                    }}
                />
            </div>
        );

        return (
            <Image.Group>{images}</Image.Group>
        )
    }

    renderEditMapModal() {
        let position = [52, 12];

        if (undefined !== this.props.ticker.location) {
            position = [this.props.ticker.location.lat, this.props.ticker.location.lon];
        }

        return (
            <EditMapModal
                geoInformation={this.state.geoInformation}
                open={this.state.showEditMapModal}
                onSubmit={(geoInformation) => this.setState({showEditMapModal: false, geoInformation: geoInformation})}
                onClose={() => this.setState({showEditMapModal: false})}
                position={position}
            />
        )
    }

    render() {
        const state = this.state;

        return (
            <Form error={state.formError}>
                <Form.Field>
                    {this.renderEditMapModal()}
                </Form.Field>
                <Form.Field style={{display: 'none'}}>
                    <Form.TextArea
                        rows='3'
                        value={JSON.stringify(state.geoInformation)}
                    />
                </Form.Field>
                <Form.Field>
                    <Form.TextArea
                        placeholder='Write a message' rows='5'
                        value={state.message}
                        onChange={this.handleInput.bind(this)}
                    />
                </Form.Field>
                <Error
                    error
                    icon='ban'
                    hidden={!state.formError}
                    header='Error'
                    content={state.formErrorMessage}
                />
                {this.renderAttachmentPreviews()}
                {this.renderAttachments()}
                <Button
                    color='teal'
                    content='Send'
                    icon='send'
                    disabled={state.formError}
                    onClick={() => this.submitMessage()}
                />
                <Button
                    color='orange'
                    content={(this.state.geoInformation.type === 'FeatureCollection') ? 'Change Map' : 'Add Map'}
                    icon={(this.state.geoInformation.type === 'FeatureCollection') ? 'map' : 'map outline'}
                    toggle
                    onClick={() => this.setState({showEditMapModal: true})}
                />
                <Button
                    color='violet'
                    content='Add Media'
                    icon='images outline'
                    onClick={() => this.fileInputRef.current.click()}
                />
                <input
                    ref={this.fileInputRef}
                    type="file"
                    hidden
                    multiple
                    onChange={this.uploadAttachment.bind(this)}
                />
                <Label
                    content={`${state.counter}/${this.counterLimit()}`}
                    color={state.counterColor} style={{float: 'right'}}
                />
            </Form>
        )
    }
}

MessageForm.propTypes = {
    ticker: PropTypes.object.isRequired,
    callback: PropTypes.func.isRequired,
};
