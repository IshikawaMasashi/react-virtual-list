import * as React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

// スタイルを定義
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2)
    },
    title: {
      borderBottom: `2px solid ${theme.palette.primary.main}`
    }
  })
);

// props の型を定義
type Props = {
  title?: string;
};

// コンポーネントを定義
function MyStyledComponent({ title }: Props) {
  // ここでクラス名を取得
  const classes = useStyles({});
  return (
    <div className={classes.root}>
      <h4 className={classes.title}>{title || "My Styled Component"}</h4>
    </div>
  );
}

// エクスポート
export default MyStyledComponent;
