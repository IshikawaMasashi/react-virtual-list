import * as React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Slider from "@material-ui/lab/Slider";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { VirtualList, ItemStyle } from "../../src";
import VolumeDown from "@material-ui/icons/VolumeDown";
import VolumeUp from "@material-ui/icons/VolumeUp";
import Input from "@material-ui/core/Input";

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
    input: {
      width: 96
    }
  })
);

// props の型を定義
type Props = {
  title?: string;
};

// コンポーネントを定義
function Example4({ title }: Props) {
  // ここでクラス名を取得
  const classes = useStyles({});

  const itemCount = 100000;

  const [itemSize, setItemSize] = React.useState<number | number[]>(50);
  const [value, setValue] = React.useState<
    number | string | Array<number | string>
  >(0);

  const handleChange = (event: any, newValue: number | number[]) => {
    setItemSize(newValue < 18 ? 18 : newValue);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value === "" ? "" : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > itemCount - 1) {
      setValue(itemCount - 1);
    }
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
      <Grid container spacing={2}>
        <Grid item></Grid>
        <Grid item></Grid>
        <Typography variant="h6" noWrap>
          Scroll to index :
        </Typography>
        <Grid item xs>
          <Input
            className={classes.input}
            value={value}
            margin="dense"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: 1,
              min: 0,
              max: itemCount,
              type: "number",
              "aria-labelledby": "input-slider"
            }}
          />
        </Grid>
        <Grid item></Grid>
      </Grid>
      <VirtualList
        width="auto"
        height={400}
        itemCount={itemCount}
        renderItem={renderItem}
        itemSize={itemSize}
        className="VirtualList"
        scrollToIndex={Number(value)}
      />
    </div>
  );
}

export default Example4;
