import React, { Component } from 'react';
import { withStyles } from '@mui/styles';
import {
    Checkbox, FormControl, MenuItem,
    Menu, List,
    ListItemButton, ListItemText,
    ListItemIcon, InputLabel, Button,
    type Theme,
} from '@mui/material';

import {
    ArrowDropDown as IconArrowDown,
    ArrowDropUp as IconArrowUp,
} from '@mui/icons-material';

import { Utils, I18n, type ThemeType } from '@iobroker/adapter-react-v5';

const styles: Record<string, any> = (theme: Theme) => ({
    navMain: {
        borderBottom: '1px solid transparent',
        '&:hover': {
            borderBottom: `1px solid ${theme.palette.mode === 'dark' ? '#BBB' : '#555'}`,
        },
    },
    listItemButton: {
        padding: 0,
        margin: 0,
    },
    nav: {
        padding: 0,
    },
    textRoot: {
        margin: 0,
    },
    menuItem: {
        borderBottom: '1px dashed gray',
    },
    primary: {
        width: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontSize: 14,
    },
    secondary: {
        fontSize: 10,
        position: 'absolute',
        bottom: -8,
        right: 20,
    },
    coloredSecondary: {
        borderRadius: 3,
        padding: '0 3px',
        opacity: 0.7,
    },
    icon: {
        width: 24,
        height: 24,
        objectFit: 'contain',
    },
    menuItemMainText: {
        fontWeight: 'bold',
        display: 'inline-block',
        verticalAlign: 'top',
    },
    menuItemIcon: {
        marginRight: 4,
        display: 'inline-block',
        height: 24,
    },
    menuToolbar: {
        paddingLeft: 8,
        paddingRight: 8,
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.secondary.dark : theme.palette.secondary.light,
    },
});

interface MultiSelectProps {
    value: string[];
    options: { value: string; name: string; subName?: string; color?: string; icon?: string }[];
    label: string;
    width: number;
    onChange: (value: string[]) => void;
    setSelectedWidgets: (widgets: string[]) => void;
    themeType: ThemeType;
    classes: Record<string, string>;
}

interface MultiSelectState {
    elAnchor: HTMLDivElement | null;
}

class MultiSelect extends Component<MultiSelectProps, MultiSelectState> {
    constructor(props: MultiSelectProps) {
        super(props);
        this.state = {
            elAnchor: null,
        };
    }

    render() {
        const props = this.props;
        const value = props.value || [];

        let text;
        let subText = null;
        let color: string;
        let icon;
        if (value.length === 1) {
            const item = props.options.find(foundItem => foundItem.value === value[0]);
            if (item) {
                text = item.name;
                subText = item.subName;
                color = item.color;
                icon = item.icon ? <img
                    src={item.icon}
                    className={props.classes.icon}
                    alt={item.name}
                /> : null;
            } else {
                text = value[0];
            }
        } else {
            text = value.join(', ');
        }

        let backColor;
        if (color) {
            backColor = Utils.getInvertedColor(color, props.themeType, false);
            if (backColor === '#DDD') {
                backColor = '#FFF';
            } else if (backColor === '#111') {
                backColor = '#000';
            }
        }

        const isNarrow = !props.label;

        return <FormControl variant="standard" style={{ margin: '0px 10px' }}>
            {props.label ? <InputLabel shrink>{props.label}</InputLabel> : null}
            <List
                component="nav"
                style={{
                    width: props.width,
                    marginTop: isNarrow ? 0 : 16,
                }}
                className={`${this.props.classes.navMain} ${isNarrow ? this.props.classes.nav : null}`}
            >
                <ListItemButton
                    onClick={e => this.setState({ elAnchor: e.currentTarget })}
                    classes={{ root: props.classes.listItemButton }}
                >
                    {icon ? <ListItemIcon style={{ minWidth: 28 }}>
                        {icon}
                    </ListItemIcon> : null}
                    <ListItemText
                        classes={{
                            root: props.classes.listItemButton,
                            primary: props.classes.primary,
                            secondary: props.classes.secondary,
                        }}
                        primary={text}
                        secondary={<span
                            style={{ color, background: backColor, whiteSpace: 'nowrap' }}
                            className={color ? props.classes.coloredSecondary : undefined}
                        >
                            {subText}
                        </span>}
                    />
                    <ListItemIcon style={{ minWidth: 16 }}>{this.state.elAnchor ? <IconArrowUp /> : <IconArrowDown />}</ListItemIcon>
                </ListItemButton>
            </List>
            <Menu
                open={!!this.state.elAnchor}
                anchorEl={this.state.elAnchor}
                onClose={() => this.setState({ elAnchor: null })}
            >
                <div className={this.props.classes.menuToolbar}>
                    {I18n.t('All')}
                    <Button
                        disabled={value.length === props.options.length}
                        onClick={() => this.props.setSelectedWidgets(props.options.map(item => item.value))}
                        startIcon={<Checkbox style={{ opacity: value.length === props.options.length ? 0.5 : 1 }} checked />}
                    >
                        {I18n.t('Select')}
                    </Button>
                    <Button
                        disabled={!value.length}
                        onClick={() => this.props.setSelectedWidgets([])}
                        startIcon={<Checkbox style={{ opacity: !value.length ? 0.5 : 1 }} />}
                    >
                        {I18n.t('Unselect')}
                    </Button>
                </div>
                {props.options.map(item => <MenuItem
                    value={item.value}
                    key={item.value}
                    className={props.classes.menuItem}
                    onClick={() =>
                        this.setState({ elAnchor: null }, () =>
                            props.onChange([item.value]))}
                >
                    <div style={{ display: 'flex' }}>
                        <div>
                            <Checkbox
                                checked={props.value.includes(item.value)}
                                onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    const _value = [...value];
                                    if (_value.includes(item.value)) {
                                        _value.splice(_value.indexOf(item.value), 1);
                                    } else {
                                        _value.push(item.value);
                                    }
                                    props.onChange(_value);
                                }}
                            />
                        </div>
                        <div>
                            {item.icon ? <div className={props.classes.menuItemIcon}>
                                <img src={item.icon} className={props.classes.icon} alt={item.name} />
                            </div> : null}
                            <div className={props.classes.menuItemMainText}>{item.name}</div>
                            <div
                                style={{
                                    fontSize: 10,
                                    fontStyle: 'italic',
                                    color: item.color,
                                    background: item.color ? Utils.getInvertedColor(item.color, props.themeType, false) : undefined,
                                }}
                                className={color ? props.classes.coloredSecondary : undefined}
                            >
                                {item.subName}
                            </div>
                        </div>
                    </div>
                </MenuItem>)}
            </Menu>
        </FormControl>;
    }
}

export default withStyles(styles)(MultiSelect);
