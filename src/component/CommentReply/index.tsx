import { useEffect, useState } from 'react';
import { Input, Button } from 'antd';

import styles from './index.less';

const { TextArea } = Input;

interface propsType {
  userInfo: any;
  handleReplyValue?: string;
  handleGetReply: (e: any) => void;
  handleCancelReply: any;
}

export default function IndexPage(props: propsType) {
  const [inputValue, setInputValue] = useState<any>('');

  const handleInputOnChange = (e: any) => {
    setInputValue(e.target.value);
  };

  const handleSetReply = () => {
    const { userInfo } = props;
    const id = Math.floor(Math.random() * 1000);
    const obj = {
      content: inputValue,
      id,
      levelId: 1,
      praise: 0,
      time: '刚刚',
      userId: id,
      parentId: userInfo.parentId || userInfo.userId,
      userName: 'Erika Mateo',
    };
    props.handleGetReply(obj);
  };

  return (
    <div className={styles.commentReplyView}>
      <TextArea onChange={handleInputOnChange} />
      <div className={styles.commentReplyViewBtn}>
        <Button
          onClick={() => {
            props.handleCancelReply();
          }}
        >
          取消
        </Button>
        <Button
          onClick={() => {
            handleSetReply();
          }}
          type="primary"
        >
          回复
        </Button>
      </div>
    </div>
  );
}
