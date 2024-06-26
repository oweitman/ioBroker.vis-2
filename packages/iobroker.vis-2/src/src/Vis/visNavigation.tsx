import React from 'react';
import { withStyles } from '@mui/styles';

import {
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Tooltip,
    Tabs,
    Tab, type Theme,
} from '@mui/material';

import {
    ChevronLeft as ChevronLeftIcon,
    Dashboard as DashboardIcon,
} from '@mui/icons-material';

import { Utils, Icon } from '@iobroker/adapter-react-v5';
import { ViewSettings } from '@iobroker/types-vis-2';

const MENU_WIDTH_FULL = 200;
const MENU_WIDTH_NARROW = 56;
const TOOLBAR_SIZE = 48;

const styles: Record<string, any> = (theme: Theme) => ({
    root: {
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        // overflow: 'hidden',
    },
    rootHorizontal: {
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        flexDirection: 'column',
        // overflow: 'hidden',
    },
    toolBar: {
        width: '100%',
        height: TOOLBAR_SIZE,
        overflow: 'hidden',
        lineHeight: `${TOOLBAR_SIZE}px`,
        paddingLeft: 16,
        fontSize: 20,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        transition: 'padding-left 0.4s ease-in-out',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
    },
    toolbarIcon: {
        height: 32,
        width: 'auto',
    },
    verticalMenu: {
        width: '100%',
        top: 0,
        left: 0,
        height: TOOLBAR_SIZE,
        overflow: 'hidden',
        lineHeight: `${TOOLBAR_SIZE}px`,
        backgroundColor: theme.palette.primary.main,
        zIndex: 450,
    },
    toolBarWithClosedMenu: {
        paddingLeft: 16 + TOOLBAR_SIZE,
    },
    viewContentWithToolbar: {
        position: 'relative',
        height: `calc(100% - ${TOOLBAR_SIZE}px)`,
        width: '100%',
    },
    viewContentWithoutToolbar: {
        position: 'relative',
        height: '100%',
        width: '100%',
    },
    openMenuButton: {
        position: 'absolute',
        top: 5,
        width: TOOLBAR_SIZE,
        height: TOOLBAR_SIZE,
        zIndex: 999,
        transition: 'all 0.3s ease-in-out',
    },
    openMenuButtonFull: {
    },
    openMenuButtonNarrow: {
        left: 8,
    },
    openMenuButtonHidden: {
        left: 8,
        opacity: 0.5,
    },
    openMenuButtonIconHidden: {
        transform: 'rotate(180deg)',
        transformOrigin: 'center',
        transition: 'all 0.3s ease-in-out',
    },
    menu: {
        transition: 'width 0.4s ease-in-out, opacity 0.3s ease-in-out',
    },
    menuFull: {
        height: '100%',
        display: 'inline-block',
        overflow: 'hidden',
        opacity: 1,
    },
    menuNarrow: {
        width: MENU_WIDTH_NARROW,
        height: '100%',
        display: 'inline-block',
        overflow: 'hidden',
        opacity: 1,
    },
    menuHidden: {
        width: 0,
        height: '100%',
        display: 'inline-block',
        opacity: 0,
    },
    afterMenu: {
        transition: 'width 0.4s ease-in-out',
    },
    afterMenuFull: {
        height: '100%',
        display: 'inline-block',
    },
    afterMenuNarrow: {
        width: `calc(100% - ${MENU_WIDTH_NARROW}px)`,
        height: '100%',
        display: 'inline-block',
    },
    afterMenuHidden: {
        width: '100%',
        height: '100%',
        display: 'inline-block',
    },
    menuList: {
        width: '100%',
        height: 'calc(100% - 49px)',
        overflowY: 'auto',
        overflowX: 'hidden',
    },
    menuItem: {
        minHeight: TOOLBAR_SIZE,
    },
    listItemIcon: {
        width: 24,
        height: 24,
    },
    listItemIconText: {
        paddingLeft: 8,
        opacity: 1,
        transition: 'opacity 0.3s ease-in-out',
        position: 'absolute',
        top: 12,
        left: 16,
    },
    listItemText: {
        whiteSpace: 'nowrap',
        transition: 'all 0.3s ease-in-out',
        opacity: 1,
    },
    listItemTextNarrow: {
        opacity: 0,
    },
    selectedMenu: {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
    },
    tooltip: {
        pointerEvents: 'none',
    },
    menuToolbar: {
        height: TOOLBAR_SIZE,
        display: 'flex',
        lineHeight: `${TOOLBAR_SIZE}px`,
        verticalAlign: 'middle',
        paddingLeft: 16,
        fontSize: 20,
        whiteSpace: 'nowrap',
        transition: 'opacity 0.3s ease-in-out',
    },
    menuToolbarFull: {
        opacity: 1,
    },
    menuToolbarNarrow: {
        opacity: 0,
    },
    transparent: {
        opacity: 0,
    },
});

interface VisNavigationProps {
    context: Record<string, any>;
    view: string;
    activeView: string;
    editMode: boolean;
    menuWidth: string;
    setMenuWidth: (width: string) => void;
    classes: Record<string, any>;
    visInWidget?: boolean;
    children: React.ReactNode;
}

interface VisNavigationState {
    menuWidth: string;
}

interface MenuItem {
    text: string;
    color: string;
    icon: string;
    noText: boolean;
    order: number;
    view: string;
}

class VisNavigation extends React.Component<VisNavigationProps, VisNavigationState> {
    renderMenu(settings: ViewSettings, menuFullWidth: number) {
        const items: MenuItem[] = [];

        Object.keys(this.props.context.views).forEach(view => {
            if (view === '___settings') {
                return;
            }
            const viewSettings = this.props.context.views[view].settings;
            if (viewSettings.navigation) {
                const item = {
                    text: settings.navigationOrientation === 'horizontal' && viewSettings.navigationOnlyIcon ? null : (viewSettings.navigationTitle || view),
                    color: viewSettings.navigationColor,
                    icon: viewSettings.navigationIcon || viewSettings.navigationImage,
                    noText: viewSettings.navigationOnlyIcon,
                    order: parseInt(viewSettings.navigationOrder ?? '0'),
                    view,
                };

                items.push(item);

                if (item.icon?.startsWith('_PRJ_NAME/')) {
                    item.icon = `../${this.props.context.adapterName}.${this.props.context.instance}/${this.props.context.projectName}${item.icon.substring(9)}`;  // "_PRJ_NAME".length = 9
                }
            }
        });

        items.sort((prevItem, nextItem) => (prevItem.order === nextItem.order ? 0 : prevItem.order < nextItem.order ? -1 : 1));

        if (settings.navigationOrientation === 'horizontal') {
            return <div
                className={this.props.classes.verticalMenu}
                style={{
                    backgroundColor: settings.navigationBarColor || this.props.context.theme.palette.background.paper,
                    opacity: this.props.editMode ? 0.4 : 1,
                    position: this.props.editMode ? 'relative' : 'fixed',
                }}
            >
                <Tabs
                    value={this.props.activeView}
                >
                    {items.map((item, index) => <Tab
                        iconPosition="start"
                        key={index}
                        style={{ minHeight: 48, minWidth: item.noText ? 20 : undefined }}
                        icon={item.icon ? <Icon src={item.icon} className={this.props.classes.listItemIcon} /> : undefined}
                        onClick={() => this.props.context.changeView(item.view)}
                        value={item.view}
                        label={item.text}
                    />)}
                </Tabs>
            </div>;
        }

        return <div
            style={{
                opacity: this.props.editMode ? 0.4 : 1,
                backgroundColor: (settings.navigationBackground as string) || undefined,
                width: this.props.menuWidth === 'full' ? menuFullWidth : undefined,
            }}
            className={Utils.clsx(
                this.props.classes.menu,
                this.props.menuWidth === 'full' && this.props.classes.menuFull,
                this.props.menuWidth === 'narrow' && this.props.classes.menuNarrow,
                this.props.menuWidth === 'hidden' && this.props.classes.menuHidden,
            )}
        >
            <div
                style={{ color: (settings.navigationHeaderTextColor as string) || undefined }}
                className={Utils.clsx(
                    this.props.classes.menuToolbar,
                    this.props.menuWidth === 'full' && this.props.classes.menuToolbarFull,
                    this.props.menuWidth === 'narrow' && this.props.classes.menuToolbarNarrow,
                    this.props.menuWidth === 'hidden' && this.props.classes.menuToolbarNarrow,
                )}
            >
                {(settings.navigationHeaderText as string) || ''}
            </div>
            <Divider />
            <div className={this.props.classes.menuList}>
                <List>
                    {items.map((item, index) => {
                        const menuItem = <ListItem
                            key={index}
                            disablePadding
                            className={Utils.clsx(this.props.classes.menuItem, this.props.activeView === item.view && this.props.classes.selectedMenu)}
                            style={{ backgroundColor: this.props.activeView === item.view ? (settings.navigationSelectedBackground as string) : undefined }}
                            onClick={async () => {
                                if (settings.navigationHideOnSelection) {
                                    await this.hideNavigationMenu();
                                }
                                await this.props.context.changeView(item.view);
                            }}
                        >
                            <ListItemButton>
                                <ListItemIcon>
                                    {item.icon ? <Icon
                                        src={item.icon}
                                        style={{ color: this.props.activeView === item.view ? (settings.navigationSelectedColor as string) : (settings.navigationColor as string), backgroundColor: 'rgba(1,1,1,0)' }}
                                        className={Utils.clsx(
                                            this.props.classes.listItemIcon,
                                            this.props.activeView === item.view && this.props.classes.selectedMenu,
                                        )}
                                    /> :
                                        <>
                                            <DashboardIcon
                                                style={{ color: this.props.activeView === item.view ? (settings.navigationSelectedColor as string) : (settings.navigationColor as string), backgroundColor: 'rgba(1,1,1,0)' }}
                                                className={Utils.clsx(
                                                    this.props.activeView === item.view && this.props.classes.selectedMenu,
                                                    this.props.menuWidth !== 'full' && this.props.classes.transparent,
                                                )}
                                            />
                                            {item.text ? <span
                                                style={{ color: this.props.activeView === item.view ? (settings.navigationSelectedColor as string) : (settings.navigationColor as string) }}
                                                className={Utils.clsx(
                                                    this.props.classes.listItemIconText,
                                                    this.props.menuWidth === 'full' && this.props.classes.transparent,
                                                )}
                                            >
                                                {item.text[0].toUpperCase()}
                                            </span> : null}
                                        </>}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    style={{ color: this.props.activeView === item.view ? (settings.navigationSelectedColor as string) : (settings.navigationColor as string) }}
                                    classes={{
                                        primary: Utils.clsx(
                                            this.props.classes.listItemText,
                                            this.props.activeView === item.view && !settings.navigationSelectedColor && this.props.classes.selectedMenu,
                                            this.props.menuWidth === 'narrow' && this.props.classes.listItemTextNarrow,
                                        ),
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>;

                        return <Tooltip
                            title={this.props.menuWidth !== 'full' ? item.text : ''}
                            key={index}
                            classes={{ popper: this.props.classes.tooltip }}
                        >
                            {menuItem}
                        </Tooltip>;
                    })}
                </List>
            </div>
        </div>;
    }

    renderToolbar(settings: ViewSettings) {
        if (!settings.navigationBar) {
            return null;
        }
        let style: React.CSSProperties;
        if (settings.navigationBarColor) {
            style = {
                backgroundColor: settings.navigationBarColor as string,
                color: Utils.getInvertedColor(settings.navigationBarColor as string, this.props.context.themeType, true),
            };
        } else {
            style = {};
        }
        style.opacity = this.props.editMode ? 0.4 : 1;

        let icon: string = (settings.navigationBarIcon || settings.navigationBarImage) as string;
        if (icon?.startsWith('_PRJ_NAME/')) {
            icon = `../${this.props.context.adapterName}.${this.props.context.instance}/${this.props.context.projectName}${icon.substring(9)}`;  // "_PRJ_NAME".length = 9
        }

        return <div
            className={Utils.clsx(
                this.props.classes.toolBar,
                this.props.menuWidth === 'hidden' && this.props.classes.toolBarWithClosedMenu,
            )}
            style={style}
        >
            {icon ? <Icon
                src={icon}
                className={this.props.classes.toolbarIcon}
            /> : null}
            {(settings.navigationBarText as string) || this.props.activeView}
        </div>;
    }

    /**
     * Hide the navigation menu
     */
    async hideNavigationMenu() {
        window.localStorage.setItem('vis.navOpened', 'hidden');
        await this.props.setMenuWidth('hidden');
    }

    render() {
        if (!this.props.context.views || !this.props.context.views[this.props.view]) {
            return null;
        }

        const settings: ViewSettings = this.props.context.views[this.props.view].settings;
        const menuFullWidth = parseInt(settings.navigationWidth as any as string, 10) || MENU_WIDTH_FULL;

        if (settings.navigation &&
            !this.props.visInWidget &&
            settings.navigationOrientation === 'horizontal' &&
            this.props.view === this.props.activeView
        ) {
            return <div className={this.props.classes.rootHorizontal}>
                {this.renderMenu(settings, menuFullWidth)}
                <div
                    className={this.props.classes.viewContentWithToolbar}
                    style={{
                        marginTop: this.props.editMode ? undefined : TOOLBAR_SIZE,
                    }}
                >
                    {this.props.children}
                </div>
            </div>;
        }

        if (!settings.navigation && settings.navigationBar) {
            return <div className={this.props.classes.afterMenuHidden}>
                {this.renderToolbar(settings)}
                <div className={this.props.classes.viewContentWithToolbar}>
                    {this.props.children}
                </div>
            </div>;
        }

        return <div className={this.props.classes.root}>
            {!settings.navigationHideMenu ? <div
                className={Utils.clsx(
                    this.props.classes.openMenuButton,
                    this.props.menuWidth === 'full' && this.props.classes.openMenuButtonFull,
                    this.props.menuWidth === 'narrow' && this.props.classes.openMenuButtonNarrow,
                    this.props.menuWidth === 'hidden' && this.props.classes.openMenuButtonHidden,
                )}
                style={{
                    left: this.props.menuWidth === 'full' ? menuFullWidth - TOOLBAR_SIZE : undefined,
                    opacity: settings.navigationBar && this.props.menuWidth === 'hidden' ? 1 : undefined,
                }}
            >
                <IconButton
                    onClick={() => {
                        if (this.props.menuWidth === 'full') {
                            window.localStorage.setItem('vis.navOpened', 'narrow');
                            this.props.setMenuWidth('narrow');
                        } else if (this.props.menuWidth === 'narrow') {
                            if (!settings.navigationNoHide) {
                                this.hideNavigationMenu();
                            } else {
                                window.localStorage.setItem('vis.navOpened', 'full');
                                this.props.setMenuWidth('full');
                            }
                        } else {
                            window.localStorage.setItem('vis.navOpened', 'full');
                            this.props.setMenuWidth('full');
                        }
                    }}
                    style={{
                        backgroundColor: this.props.menuWidth === 'hidden' && settings.navigationButtonBackground ? settings.navigationButtonBackground || (this.props.context.themeType === 'dark' ? 'white' : 'black') : 'inherit',
                        color: this.props.menuWidth === 'hidden' && settings.navigationButtonBackground ? settings.navigationButtonBackground || (this.props.context.themeType === 'dark' ? 'black' : 'white')  : 'inherit',
                    }}
                >
                    <ChevronLeftIcon
                        className={this.props.menuWidth === 'hidden' || (this.props.menuWidth === 'narrow' && settings.navigationNoHide) ? this.props.classes.openMenuButtonIconHidden : ''}
                        style={settings.navigationBar && this.props.menuWidth === 'hidden' ? { color: settings.navigationChevronColor || (this.props.context.themeType === 'dark' ? '#000' : '#FFF') } : { color: (settings.navigationChevronColor as string) }}
                    />
                </IconButton>
            </div> : null}
            {!settings.navigationHideMenu ? this.renderMenu(settings, menuFullWidth) : null}
            <div
                className={Utils.clsx(
                    this.props.classes.afterMenu,
                    !settings.navigationHideMenu && this.props.menuWidth === 'full' && this.props.classes.afterMenuFull,
                    !settings.navigationHideMenu && this.props.menuWidth === 'narrow' && this.props.classes.afterMenuNarrow,
                    (settings.navigationHideMenu || this.props.menuWidth === 'hidden') && this.props.classes.afterMenuHidden,
                )}
                style={{
                    width: !settings.navigationHideMenu && this.props.menuWidth === 'full' ? `calc(100% - ${menuFullWidth}px)` : undefined,
                }}
            >
                {this.renderToolbar(settings)}
                <div className={settings.navigationBar ? this.props.classes.viewContentWithToolbar : this.props.classes.viewContentWithoutToolbar}>
                    {this.props.children}
                </div>
            </div>
        </div>;
    }
}

export default withStyles(styles)(VisNavigation);
