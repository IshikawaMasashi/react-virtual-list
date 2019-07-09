import * as React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Slider from "@material-ui/lab/Slider";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { VirtualList, ItemStyle } from "../../src";
import VolumeDown from "@material-ui/icons/VolumeDown";
import VolumeUp from "@material-ui/icons/VolumeUp";
import Button from "@material-ui/core/Button";

const { useEffect, useRef } = React;

// スタイルを定義
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(6)
    },
    title: {
      borderBottom: `2px solid ${theme.palette.primary.main}`
    },
    paper: {
      padding: 18
    },
    button: {
      margin: theme.spacing(1)
    }
  })
);

// props の型を定義
type Props = {
  title?: string;
};

// コンポーネントを定義
function Example2({ title }: Props) {
  // ここでクラス名を取得
  const classes = useStyles({});

  const itemCount = 100000;

  const [itemSize, setItemSize] = React.useState<number | number[]>(50);
  const handleChange = (event: any, newValue: number | number[]) => {
    setItemSize(newValue < 18 ? 18 : newValue);
  };

  function createRowHeights() {
    const heights = [];
    for (let i = 0; i < itemCount; ++i) {
      heights.push(Math.round(Math.random() * 130 + 20));
    }
    return heights;
  }
  const [rowHeights, setRowHeights] = React.useState<number[]>(
    createRowHeights()
  );

  function onClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    setRowHeights(createRowHeights());
  }

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
      <Grid container spacing={2}>
        <Grid item></Grid>
        <Grid item></Grid>
        <Grid item xs>
          <Button
            variant="contained"
            className={classes.button}
            onClick={onClick}
          >
            Randomize heights
          </Button>
        </Grid>
        <Grid item></Grid>
      </Grid>
      <VirtualList
        width="auto"
        height={400}
        itemCount={itemCount}
        renderItem={renderItem}
        itemSize={index => rowHeights[index]}
        className="VirtualList"
      />
    </div>
  );
}

export default Example2;
