import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';
import NavigationDrawer from 'react-md/lib/NavigationDrawers';
import FontIcon from 'react-md/lib/FontIcons';

// Sadly the active prop on Link and IndexLink won't work correctly since
// they rely on context for updates and react-md uses PureComponent behind
// the scenes so the context updates don't happen.
function isActive(to, path) {
    return to === path;
}

class App extends Component {
    render() {
        const {
            location: { pathname },
            children,
        } = this.props;

        return (
            <NavigationDrawer
                drawerTitle="Navigation"
                toolbarTitle="Project Estrella"
                navItems={[{
                    component: IndexLink,
                    to: '/',
                    active: isActive('/', pathname),
                    primaryText: 'Home',
                    leftIcon: <FontIcon>home</FontIcon>,
                }, {
                    component: Link,
                    to: '/admin',
                    active: isActive('/admin', pathname),
                    primaryText: 'Admin Page',
                    leftIcon: <FontIcon>bookmark</FontIcon>,
                }, {
                    component: Link,
                    to: '/user',
                    active: isActive('/user', pathname),
                    primaryText: 'User Page',
                    leftIcon: <FontIcon>donut_large</FontIcon>,
                }]}
            >
                {children ? React.cloneElement(children, { key: pathname }) : null}
            </NavigationDrawer>
        );
    }
}

export default App;
