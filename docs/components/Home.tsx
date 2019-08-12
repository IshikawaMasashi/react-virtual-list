import * as React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { VirtualList, ItemStyle } from "../../src";
import GetApp from "@material-ui/icons/GetApp";
import Build from "@material-ui/icons/Build";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

// import okaidia from "react-syntax-highlighter/dist/esm/styles/prism/okaidia";
const styles = require("react-syntax-highlighter/dist/esm/styles/prism");

const { useEffect, useRef } = React;

// スタイルを定義
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2)
    },
    title: {
      borderBottom: `2px solid ${theme.palette.primary.main}`
    },
    paper: {
      padding: 18,
      margin: 18,
      backgroundColor: "#f5f5f5"
    },
    grid: {
      //   color: "#fff",
      //   background: "#2C7575",
      //   backgroundImage: "linear-gradient(120deg, #023463, #149454)"
      // margin: 36
    },
    icon: {
      margin: theme.spacing(1),
      fontSize: 32
    },
    container: {
      color: "#1976d2",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    label: {
      color: "#1976d2",
      display: "flex",
      alignItems: "center"
    }
  })
);

// props の型を定義
// type Props = {
// };

// コンポーネントを定義
function Home() {
  // ここでクラス名を取得
  const classes = useStyles({});
  const [itemSize, setItemSize] = React.useState<number | number[]>(50);
  const handleChange = (event: any, newValue: number | number[]) => {
    setItemSize(newValue < 18 ? 18 : newValue);
  };

  const renderItem = ({
    style,
    index
  }: {
    style: ItemStyle;
    index: number;
  }) => {
    return (
      <div className="Row" style={style} key={index}>
        Row #{index}
      </div>
    );
  };

  return (
    <div className={classes.root}>
      <Grid className={classes.grid} container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <div className={classes.container}>
            <Typography variant="h4" noWrap>
              React Virtual List
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12}>
          <div className={classes.container}>
            <Typography variant="h6" noWrap>
              A tiny but mighty list virtualization library, with zero
              dependencies 💪
            </Typography>
          </div>
        </Grid>
      </Grid>

      <Paper className={classes.paper} elevation={0}>
        <div className={classes.label}>
          <GetApp className={classes.icon} />
          <Typography variant="h5" noWrap>
            react-virtual-list
          </Typography>
        </div>
        <VirtualList
          width="auto"
          height={400}
          itemCount={100000}
          renderItem={renderItem}
          itemSize={itemSize}
          className="VirtualList"
        />
      </Paper>
      <Paper className={classes.paper} elevation={0}>
        <div className={classes.label}>
          <GetApp className={classes.icon} />
          <Typography variant="h5" noWrap>
            Installation
          </Typography>
        </div>
        <Typography component="p">
          Install React Virtual List source files via npm.
        </Typography>
        <SyntaxHighlighter language="basic" style={styles.okaidia}>
          {"$ npm install @ishikawa_masashi/react-virtual-list"}
        </SyntaxHighlighter>
      </Paper>

      <Paper className={classes.paper} elevation={0}>
        <div className={classes.label}>
          <Build className={classes.icon} />
          <Typography variant="h5" noWrap>
            Usage
          </Typography>
        </div>
        <Typography component="p"></Typography>
        <SyntaxHighlighter language="js" style={styles.okaidia}>
          {`import React from 'react';
import {render} from 'react-dom';
import VirtualList from '@ishikawa_masashi/react-virtual-list';

const data = ['A', 'B', 'C', 'D', 'E', 'F', ...];

render(
  <VirtualList
    width='100%'
    height={600}
    itemCount={data.length}
    itemSize={50} // Also supports variable heights (array or function getter)
    renderItem={({index, style}) =>
      <div key={index} style={style}> // The style property contains the item's absolute position
        Letter: {data[index]}, Row: #{index}
      </div>
    }
  />,
  document.getElementById('root')
);`}
        </SyntaxHighlighter>
      </Paper>
    </div>
  );
}

export default Home;
