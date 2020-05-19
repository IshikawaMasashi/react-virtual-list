import React from 'react';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import { VirtualList, ItemStyle } from '../../src';
import Home from './Home';

enum View {
  Example1,
  Example2,
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    backgroundColor: '#fff',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    marginLeft: drawerWidth,
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  title: {
    padding: 16,
  },
  link: {
    // margin: theme.spacing(1)
  },
}));

type Props = {};
export default function ResponsiveDrawer(props: Props) {
  const basicSetup = [
    'Elements of equal height',
    'Variable heights',
    'Horizontal list',
  ];

  const controlledProps = ['Scroll to index', 'Controlled scroll offset'];

  const labels = basicSetup.concat(controlledProps);

  // const { container } = props;
  const classes = useStyles({});
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const [view, setView] = React.useState(View.Example1);

  function handleDrawerToggle() {
    setMobileOpen(!mobileOpen);
  }

  const [selectedIndex, setSelectedIndex] = React.useState(0);

  function handleListItemClick(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ): void {
    setSelectedIndex(index);
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <main className={classes.content}>
        <Home />
      </main>
    </div>
  );
}
