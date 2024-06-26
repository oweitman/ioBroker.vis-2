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
import PropTypes from 'prop-types';

// eslint-disable-next-line import/no-cycle
import JQuiButton from './JQuiButton';

class JQuiButtonPasswordNavigation extends JQuiButton {
    static getWidgetInfo() {
        const widgetInfo = JQuiButton.getWidgetInfo();

        const newWidgetInfo = {
            id: 'tplJquiNavPw',
            visSet: 'jqui',
            visName: 'Navigation with password',
            visWidgetLabel: 'jqui_navigation_password',
            visPrev: 'widgets/jqui/img/Prev_ButtonNavPw.png',
            visOrder: 10,
            visAttrs: widgetInfo.visAttrs,
        };

        // Add note
        newWidgetInfo.visAttrs[0].fields.unshift({
            name: '_note',
            type: 'help',
            text: 'jqui_button_nav_blank_note',
        });

        const modal = JQuiButton.findField(newWidgetInfo, 'modal');
        delete modal.default;

        const text = JQuiButton.findField(newWidgetInfo, 'buttontext');
        text.default = 'Password';

        const navView = JQuiButton.findField(newWidgetInfo, 'nav_view');
        navView.default = '';

        const password = JQuiButton.findField(newWidgetInfo, 'Password');
        password.default = '';

        // set resizable to true
        const visResizable = JQuiButton.findField(newWidgetInfo, 'visResizable');
        visResizable.default = true;

        return newWidgetInfo;
    }

    // eslint-disable-next-line class-methods-use-this
    getWidgetInfo() {
        return JQuiButtonPasswordNavigation.getWidgetInfo();
    }
}

JQuiButtonPasswordNavigation.propTypes = {
    id: PropTypes.string.isRequired,
    context: PropTypes.object.isRequired,
    view: PropTypes.string.isRequired,
    editMode: PropTypes.bool.isRequired,
    tpl: PropTypes.string.isRequired,
};

export default JQuiButtonPasswordNavigation;
