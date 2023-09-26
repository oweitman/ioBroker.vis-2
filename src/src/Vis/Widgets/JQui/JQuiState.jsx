/**
 *  ioBroker.vis
 *  https://github.com/ioBroker/ioBroker.vis
 *
 *  Copyright (c) 2023 Denis Haev https://github.com/GermanBluefox,
 *  Creative Common Attribution-NonCommercial (CC BY-NC)
 *
 *  http://creativecommons.org/licenses/by-nc/4.0/
 *
 * Short content:
 * Licensees may copy, distribute, display and perform the work and make derivative works based on it only if they give the author or licensor the credits in the manner specified by these.
 * Licensees may copy, distribute, display, and perform the work and make derivative works based on it only for noncommercial purposes.
 * (Free for non-commercial use).
 */

import React from 'react';
import PropTypes from 'prop-types';

import {
    Button,
    Tooltip,
    ButtonGroup, Radio,
    RadioGroup,
    FormControlLabel, MenuItem,
    Select,
    FormControl,
    InputLabel,
    FormLabel, Slider,
} from '@mui/material';

import {
    I18n,
    Icon,
} from '@iobroker/adapter-react-v5';

// eslint-disable-next-line import/no-cycle
import VisRxWidget from '../../visRxWidget';
import BulkEditor from './BulkEditor';

class JQuiState extends VisRxWidget {
    constructor(props) {
        super(props);
        this.state.value = '';
        this.state.valueType = null;
    }

    static getWidgetInfo() {
        return {
            id: 'tplJquiButtonState',
            visSet: 'jqui',
            visName: 'States control',
            visWidgetLabel: 'jqui_states_control',
            visPrev: 'widgets/jqui/img/Prev_ButtonState.png',
            visOrder: 14,
            visAttrs: [
                {
                    name: 'common',
                    fields: [
                        {
                            name: 'type',
                            label: 'jqui_type',
                            type: 'select',
                            noTranslation: true,
                            default: 'button',
                            options: ['button', 'select', 'radio', 'slider'],
                        },
                        {
                            name: 'oid',
                            type: 'id',
                            onChange: async (field, data, changeData, socket) => {
                                if (data[field.name]) {
                                    if (await BulkEditor.generateFields(data, socket)) {
                                        changeData(data);
                                    }
                                }
                            },
                        },
                        {
                            name: 'readOnly',
                            type: 'checkbox',
                        },
                        {
                            name: 'click_id',
                            type: 'id',
                            noSubscribe: true,
                            hidden: data => !!data.readOnly,
                        },
                        {
                            name: 'count',
                            type: 'slider',
                            min: 0,
                            default: 1,
                            max: 10,
                            hidden: data => !!data.percents,
                        },
                        {
                            name: 'generate',
                            type: 'custom',
                            component: (
                                field,
                                data,
                                onDataChange,
                                props, // {context: {views, view, socket, themeType, projectName, adapterName, instance, id, widget}, selectedView, selectedWidget, selectedWidgets}
                            ) => <BulkEditor
                                data={data}
                                onDataChange={onDataChange}
                                socket={props.context.socket}
                                themeType={props.context.themeType}
                                adapterName={props.context.adapterName}
                                instance={props.context.instance}
                                projectName={props.context.projectName}
                            />,
                        },
                        {
                            name: 'variant',
                            label: 'jqui_variant',
                            type: 'select',
                            noTranslation: true,
                            options: ['contained', 'outlined', 'text', 'standard'],
                            default: 'contained',
                            hidden: data => data.type !== 'button' && data.type !== 'select',
                        },
                        {
                            name: 'orientation',
                            label: 'orientation',
                            type: 'select',
                            options: ['horizontal', 'vertical'],
                            default: 'horizontal',
                            hidden: data => data.type !== 'button' && data.type !== 'slider',
                        },
                        {
                            name: 'widgetTitle',
                            label: 'name',
                            type: 'text',
                        },
                        {
                            name: 'timeout',
                            label: 'jqui_set_timeout',
                            type: 'number',
                            hidden: data => data.type !== 'slider',
                        },
                    ],
                },
                {
                    name: 'states',
                    label: 'group_value',
                    indexFrom: 1,
                    indexTo: 'count',
                    hidden: data => !!data.percents,
                    fields: [
                        {
                            name: 'value',
                            type: 'text',
                            label: 'value',
                            default: '0',
                        },
                        {
                            name: 'test',
                            type: 'checkbox',
                            label: 'test',
                            onChange: async (field, data, changeData, socket, index) => {
                                if (data[field.name]) {
                                    let changed = false;
                                    // deactivate all other tests
                                    for (let i = 1; i <= data.count; i++) {
                                        if (i !== index) {
                                            if (data[`test${i}`]) {
                                                changed = true;
                                                data[`test${i}`] = false;
                                            }
                                        }
                                    }
                                    changed && changeData(data);
                                }
                            },
                            hidden: (data, index) => data.type !== 'slider' || data[`value${index}`] === '' || data[`value${index}`] === null || data[`value${index}`] === undefined,
                        },
                        {
                            name: 'text',
                            default: I18n.t('Value'),
                            type: 'text',
                            label: 'text',
                            hidden: (data, index) => data[`value${index}`] === '' || data[`value${index}`] === null || data[`value${index}`] === undefined,
                        },
                        {
                            name: 'color',
                            type: 'color',
                            label: 'color',
                            hidden: (data, index) => data.type !== 'slider' || data[`value${index}`] === '' || data[`value${index}`] === null || data[`value${index}`] === undefined,
                        },
                        {
                            name: 'activeColor',
                            type: 'color',
                            label: 'active_color',
                            hidden: (data, index) => data.type !== 'slider' || data[`value${index}`] === '' || data[`value${index}`] === null || data[`value${index}`] === undefined,

                        },
                        {
                            name: 'image',
                            label: 'jqui_image',
                            type: 'image',
                            hidden: (data, index) => data.type !== 'slider' || !!data.icon || data[`value${index}`] === '' || data[`value${index}`] === null || data[`value${index}`] === undefined,
                        },
                        {
                            name: 'icon',
                            label: 'jqui_icon',
                            type: 'icon64',
                            hidden: (data, index) => data.type !== 'slider' || !!data.image || data[`value${index}`] === '' || data[`value${index}`] === null || data[`value${index}`] === undefined,
                        },
                        {
                            name: 'tooltip',
                            label: 'tooltip',
                            type: 'text',
                            hidden: (data, index) => data.type !== 'slider' || data[`value${index}`] === '' || data[`value${index}`] === null || data[`value${index}`] === undefined,
                        },
                    ],
                },
            ],
            visDefaultStyle: {
                width: 300,
                height: 40,
            },
        };
    }

    async componentDidMount() {
        super.componentDidMount();
        if (this.state.rxData.oid && this.state.rxData.oid !== 'nothing_selected') {
            const state = await this.props.context.socket.getState(this.state.rxData.oid);
            this.onStateUpdated(this.state.rxData.oid, state);
        }
    }

    static findField(widgetInfo, name) {
        return VisRxWidget.findField(widgetInfo, name);
    }

    // eslint-disable-next-line class-methods-use-this
    getWidgetInfo() {
        return JQuiState.getWidgetInfo();
    }

    onStateUpdated(id, state) {
        if (id === this.state.rxData.oid && state) {
            const value = state.val === null || state.val === undefined ? '' : state.val;

            if (this.state.value !== value.toString()) {
                this.setState({ value: value.toString() });
            }
        }
    }

    getControlOid() {
        if (this.state.rxData.click_id && this.state.rxData.click_id !== 'nothing_selected') {
            return this.state.rxData.click_id;
        }
        if (this.state.rxData.oid && this.state.rxData.oid !== 'nothing_selected') {
            return this.state.rxData.oid;
        }
        return '';
    }

    async onClick(indexOrValue, immediately) {
        if (this.state.rxData.readOnly || this.props.editMode) {
            return;
        }

        if (this.state.rxData.type === 'slider') {
            this.setTimeout && clearTimeout(this.setTimeout);
            this.setTimeout = setTimeout(() => {
                this.setTimeout = null;
                const oid = this.getControlOid();
                if (oid) {
                    this.props.context.socket.setState(oid, parseFloat(indexOrValue));
                }
            }, immediately ? 0 : parseInt(this.state.rxData.timeout, 10) || 300);
            this.setState({ value: indexOrValue });
        } else {
            const oid = this.getControlOid();
            if (oid) {
                if (this.state.valueType === 'number') {
                    this.props.context.socket.setState(oid, parseFloat(this.state.rxData[`value${indexOrValue}`]));
                } else {
                    this.props.context.socket.setState(oid, this.state.rxData[`value${indexOrValue}`]);
                }
            }
            this.setState({ value: this.state.rxData[`value${indexOrValue}`] });
        }
    }

    getSelectedIndex(value) {
        if (value === undefined) {
            value = this.state.value;
        }

        if (this.props.editMode) {
            for (let i = 1; i <= this.state.rxData.count; i++) {
                if (this.state.rxData[`test${i}`]) {
                    return i;
                }
            }
        }
        for (let i = 1; i <= this.state.rxData.count; i++) {
            if (this.state.rxData[`value${i}`] === value) {
                return i;
            }
        }
        return 0;
    }

    renderIcon(i, selectedIndex) {
        let color;
        const icon = this.state.rxData[`icon${i}`];
        if (icon && this.state.rxData[`color${i}`]) {
            color = this.state.rxData[`color${i}`];
            if (i === selectedIndex && this.state.rxData[`activeColor${i}`]) {
                color = this.state.rxData[`activeColor${i}`];
            }
        }

        if (icon) {
            return <Icon
                key="icon"
                style={{ color }}
                src={icon}
            />;
        }
        return null;
    }

    renderText(i, selectedIndex) {
        let text = this.state.rxData[`text${i}`];
        let color = this.state.rxData[`color${i}`];
        if (i === selectedIndex && this.state.rxData[`activeColor${i}`]) {
            color = this.state.rxData[`activeColor${i}`];
        }

        text = text || this.state.rxData[`value${i}`];

        return <span style={{ color }}>{text}</span>;
    }

    renderButton(i, selectedIndex, buttonStyle) {
        const icon = this.renderIcon(i, selectedIndex);
        const text = this.renderText(i, selectedIndex);

        // Button
        const button = <Button
            key={i}
            style={buttonStyle}
            startIcon={icon}
            color={selectedIndex === i ? 'primary' : 'grey'}
            onClick={() => this.onClick(i)}
        >
            {text}
        </Button>;

        if (this.state.rxData[`tooltip${i}`]) {
            return <Tooltip key={i} title={this.state.rxData[`tooltip${i}`]}>
                {button}
            </Tooltip>;
        }
        return button;
    }

    renderRadio(i, selectedIndex, buttonStyle) {
        const icon = this.renderIcon(i, selectedIndex);
        let text = this.renderText(i, selectedIndex);

        if (icon && text) {
            text = <div style={{ display: 'flex', gap: 4 }}>
                {icon}
                {text}
            </div>;
        }

        // Button
        const button = <FormControlLabel
            key={i}
            style={buttonStyle}
            control={<Radio
                onClick={() => this.onClick(i)}
                checked={selectedIndex === i}
            />}
            labelPlacement="end"
            label={text || icon}
        />;

        if (this.state.rxData[`tooltip${i}`]) {
            return <Tooltip key={i} title={this.state.rxData[`tooltip${i}`]}>
                {button}
            </Tooltip>;
        }
        return button;
    }

    renderMenuItem(i, selectedIndex, buttonStyle) {
        const icon = this.renderIcon(i, selectedIndex);
        let text = this.renderText(i, selectedIndex);

        if (icon && text) {
            text = <div style={{ display: 'flex', gap: 4 }}>
                {icon}
                {text}
            </div>;
        }

        // Button
        return <MenuItem
            title={this.state.rxData[`tooltip${i}`]}
            key={i}
            selected={selectedIndex === i}
            style={buttonStyle}
            value={this.state.rxData[`value${i}`]}
        >
            {text || icon}
        </MenuItem>;
    }

    renderWidgetBody(props) {
        super.renderWidgetBody(props);
        const selectedIndex = this.getSelectedIndex();

        if (this.state.object?._id !== this.state.rxData.oid && this.state.object !== false) {
            this.state.object = false;
            setTimeout(async () => {
                if (this.state.rxData.oid && this.state.rxData.oid !== 'nothing_selected') {
                    const obj = await this.props.context.socket.getObject(this.state.rxData.oid);
                    if (obj?.common?.type) {
                        this.setState({ object: { _id: obj._id, common: { type: obj.common.type } } });
                        return;
                    }
                }
                this.setState({ object: { _id: this.state.rxData.oid, common: { type: 'string' } } });
            }, 0);
        }

        const buttonStyle = {};
        // apply style from the element
        Object.keys(this.state.rxStyle).forEach(attr => {
            const value = this.state.rxStyle[attr];
            if (value !== null &&
                value !== undefined &&
                VisRxWidget.POSSIBLE_MUI_STYLES.includes(attr)
            ) {
                attr = attr.replace(
                    /(-\w)/g,
                    text => text[1].toUpperCase(),
                );
                buttonStyle[attr] = value;
            }
        });

        let content;
        if (
            (!this.state.rxData.count ||
                (this.state.rxData.count === 1 && !this.state.rxData.text0 && !this.state.rxData.icon0 && !this.state.rxData.image0)) &&
            (!this.state.rxData.oid || this.state.rxData.oid === 'nothing_selected')
        ) {
            content = <Button
                variant="outlined"
                style={{ width: '100%', height: '100%' }}
            >
                {I18n.t('Select object ID')}
            </Button>;
        } else if (!this.state.rxData.count) {
            content = <Button
                variant="outlined"
                style={{ width: '100%', height: '100%' }}
            >
                {I18n.t('Please define states')}
            </Button>;
        }  else if (this.state.rxData.type === 'radio') {
            const buttons = [];
            for (let i = 1; i <= this.state.rxData.count; i++) {
                buttons.push(this.renderRadio(i, selectedIndex, buttonStyle));
            }

            content = <RadioGroup
                style={{ width: '100%', height: '100%' }}
                variant={this.state.rxData.variant === undefined ? 'contained' : this.state.rxData.variant}
            >
                {buttons}
            </RadioGroup>;
        } else if (this.state.rxData.type === 'select') {
            const buttons = [];
            for (let i = 1; i <= this.state.rxData.count; i++) {
                buttons.push(this.renderMenuItem(i, selectedIndex, buttonStyle));
            }

            let variant = 'standard';
            if (this.state.rxData.variant === 'contained') {
                variant = 'filled';
            } else if (this.state.rxData.variant === 'outlined') {
                variant = 'outlined';
            }

            content = <Select
                style={{ width: '100%', height: '100%', marginTop: 4 }}
                value={this.state.value}
                onChange={e => this.onClick(this.getSelectedIndex(e.target.value))}
                variant={variant}
            >
                {buttons}
            </Select>;
        } else if (this.state.rxData.type === 'slider') {
            props.style.overflow = 'visible';
            const marks = [];
            for (let i = 1; i <= this.state.rxData.count; i++) {
                marks.push({
                    value: parseFloat(this.state.rxData[`value${i}`] || 0),
                    label: this.state.rxData[`text${i}`] || 0,
                });
            }

            content = <Slider
                style={!this.state.rxData.orientation || this.state.rxData.orientation === 'horizontal' ?
                    { marginLeft: 20, marginRight: 20, width: 'calc(100% - 40px)' } :
                    { marginTop: 10, marginBottom: 10 }}
                value={parseFloat(this.state.value) || 0}
                valueLabelDisplay="auto"
                min={marks[0].value}
                max={marks[marks.length - 1].value}
                orientation={this.state.rxData.orientation || 'horizontal'}
                marks={marks}
                onChangeCommitted={(e, value) => this.onClick(value, true)}
                onChange={(e, value) => this.onClick(value)}
            />;
        } else {
            const buttons = [];
            for (let i = 1; i <= this.state.rxData.count; i++) {
                buttons.push(this.renderButton(i, selectedIndex, buttonStyle));
            }

            content = <ButtonGroup
                style={{ width: '100%', height: '100%' }}
                orientation={this.state.rxData.orientation || 'horizontal'}
                variant={this.state.rxData.variant === undefined ? 'contained' : this.state.rxData.variant}
            >
                {buttons}
            </ButtonGroup>;
        }

        if (this.state.rxData.widgetTitle) {
            content = <FormControl
                fullWidth
                style={{
                    marginTop: this.state.rxData.type === 'select' ? 5 : undefined,
                    width: '100%',
                    height: '100%',
                }}
            >
                {this.state.rxData.type === 'select' ?
                    <InputLabel>{this.state.rxData.widgetTitle}</InputLabel> :
                    <FormLabel style={this.state.rxData.type === 'slider' ? { marginLeft: 10 } : undefined}>{this.state.rxData.widgetTitle}</FormLabel>}
                {content}
            </FormControl>;
        }

        return <div className="vis-widget-body">
            {content}
        </div>;
    }
}

JQuiState.propTypes = {
    id: PropTypes.string.isRequired,
    context: PropTypes.object.isRequired,
    view: PropTypes.string.isRequired,
    editMode: PropTypes.bool.isRequired,
    tpl: PropTypes.string.isRequired,
};

export default JQuiState;