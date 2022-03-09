import React, { useEffect, useState } from 'react';
import { Comment, Avatar, Input, Button, Tooltip, Select } from 'antd';
import styles from './index.less';
import {
  LikeOutlined,
  MessageOutlined,
  DeleteOutlined,
  LikeFilled,
  FormOutlined,
} from '@ant-design/icons';
import { history, useModel } from 'umi';
import InputContainer from '@/component/CommentReply/index';

const { TextArea } = Input;

interface proptType {
  data: any;
}

export default function IndexPage(props: proptType) {
  const [commentValue, setCommentValue] = useState<string>('');
  const [mouseEnterIdx, setMouseEnterIdx] = useState<string>('');
  const [replyValue, setReplyValue] = useState<string>('');
  const [userIdInput, setUserIdInput] = useState<any>(NaN);
  const [refresh, setrefresh] = useState<boolean>(false);
  const { commentDatas, signinComment } = useState(
    [
      {
        userName: 'Erika Mateo',
        content:
          'New law says animals must be stunned before slaughter, winning activists support but upsetting Jews and Muslims',
        praise: 0,
        time: '3小时前',
        userId: 1,
        levelId: 0,
        id: 1,
        disable: false,
      },
      {
        userName: 'Paul Neal',
        content:
          'New law says animals must be stunned before slaughter, winning activists support but upsetting Jews and Muslims.upsetting Jews and Muslims.',
        praise: 20,
        time: '4小时前',
        levelId: 0,
        userId: 2,
        id: 2,
        disable: false,
      },
      {
        userName: '仁璧成',
        content:
          'New law says animals must be stunned before slaughter, winning activists support but upsetting Jews and Muslims.upsetting Jews and Muslims.',
        praise: 11,
        time: '5小时前',
        levelId: 0,
        userId: 3,
        id: 3,
        asdsad: '1111',
        disable: false,
        list: [
          {
            userName: 'Erika Mateo11',
            content: 'Other halal meat consumers worry about a jump in prices.',
            praise: 0,
            time: '5小时前',
            levelId: 1,
            userId: 4,
            id: 4,
            disable: false,
            parentId: 3,
          },
        ],
      },
    ],
  );

  const { data } = props;
  const like = (props: any) => {
    const { userId } = props;
    commentDatas.map((item: any) => {
      if (userId == item.userId && !item.disable) {
        item.praise = item.praise + 1;
        item.disable = true;
      }
      if (item.list) {
        item.list.map((val: any) => {
          if (userId == val.userId && !val.disable) {
            val.praise = val.praise + 1;
            val.disable = true;
          }
        });
      }
    });
    signinComment(commentDatas);
  };

  const reply = (props: any) => {
    setUserIdInput(props.userId);
  };

  const handleCommentItemMouseEnter = (props: any) => {
    setMouseEnterIdx(props.userName);
  };
  const handleCommentItemMouseLeave = (props: any) => {
    setMouseEnterIdx('');
  };

  const handleDeleteComment = (props: any) => {
    commentDatas.some((item: any, i: number) => {
      if (item.userId == props.userId) {
        commentDatas.splice(i, 1);
      }
      if (item.list) {
        item.list.some((val: any, j: number) => {
          if (val.userId == props.userId) {
            item.list.splice(j, 1);
          }
        });
      }
    });
    signinComment([...commentDatas]);
    setrefresh(true);
  };

  useEffect(() => {
    refresh && setrefresh(false);
  }, [commentDatas, refresh]);

  const handleGetReply = (obj: any) => {
    const { parentId } = obj;
    console.log(obj, 'obj');
    commentDatas.map((item: any) => {
      if (item.userId === obj.parentId) {
        const { list = [] } = item;
        list.push(obj);
        item.list = list;
      }
    });
    signinComment([...commentDatas]);
    setrefresh(true);
    setUserIdInput(NaN);
  };

  const handleCancelReply = () => {
    setUserIdInput(NaN);
    console.log('cancel');
  };

  const handleEditContent = (itemInfo: any) => {
    console.log(itemInfo, 'info');
  };

  const ExampleComment = (props: any) => (
    <Comment
      className={styles.commentItem}
      // onMouseLeave={() => {
      //     handleCommentItemMouseLeave(props);
      // }}
      // onMouseEnter={() => {
      //     handleCommentItemMouseEnter(props);
      // }}
      actions={[
        <Tooltip key="comment-basic-like" title="Like">
          <span
            onClick={() => {
              like(props);
            }}
          >
            {React.createElement(props.disable ? LikeFilled : LikeOutlined)}
            <span className="comment-action">&nbsp;{props.praise}</span>
          </span>
        </Tooltip>,
        <Tooltip key="comment-basic-dislike" title="Dislike">
          <span
            style={{ position: 'relative' }}
            onClick={() => {
              reply(props);
            }}
          >
            <MessageOutlined />
          </span>
        </Tooltip>,
      ]}
      author={<a>{props.userName}</a>}
      avatar={
        <Tooltip
          key="comment-basic-dislike"
          title={
            <Avatar
              style={{ width: '150px', height: '150px' }}
              src="https://joeschmoe.io/api/v1/random"
              alt="Han Solo"
            />
          }
        >
          <Avatar
            src="https://joeschmoe.io/api/v1/random"
            alt={props.userName}
          />
        </Tooltip>
      }
      datetime={<Tooltip title={'2022/3/5'}>{props.time}</Tooltip>}
      style={{
        margin: props.levelId !== 0 ? '5px 0' : '0',
        background: props.levelId !== 0 ? '#F8F9FA' : '#FFF',
        padding: props.levelId == 0 ? '20px 0' : '0',
        borderBottom:
          props.levelId == 0 ? '1px solid #DEE0E3' : '1px solid transparen',
        position: 'relative',
      }}
      content={
        <div className={styles.commentItemContent}>
          <p>{props.content}</p>
          <div className={styles.commentItemContentIcon}>
            <DeleteOutlined
              onClick={() => {
                handleDeleteComment(props);
              }}
            />
            <FormOutlined
              onClick={() => {
                handleEditContent(props);
              }}
            />
          </div>
        </div>
      }
    >
      {props.children}
      {userIdInput === props.userId && (
        <InputContainer
          handleGetReply={handleGetReply}
          userInfo={props}
          handleCancelReply={handleCancelReply}
        />
      )}
    </Comment>
  );

  const handleOnChange = ({ target: { value } }: any) => {
    setCommentValue(value);
  };

  const handleCommentClick = () => {
    const obj = {
      userName: 'zhc',
      userId: Math.random(),
      content: commentValue,
      praise: 0,
      time: '刚刚',
      levelId: 0,
    };
    commentDatas.unshift(obj);
    signinComment(commentDatas);
    setCommentValue('');
  };

  return (
    <div className={styles.commentView}>
      <div className={styles.commentViewTextarea}>
        <TextArea
          value={commentValue}
          onChange={handleOnChange}
          placeholder="留下你的第一个评论。"
          autoSize={{ minRows: 3, maxRows: 5 }}
        />
        <div>
          <Button danger onClick={handleCommentClick}>
            评论
          </Button>
        </div>
      </div>
      <hr className={styles.commentHr} />
      <div className={styles.commentViewContent}>
        <h5>全部评论</h5>
        {commentDatas.map((item: any, idx: number) => {
          return (
            <ExampleComment
              className={styles.commentItem}
              userName={item.userName}
              userId={item.userId}
              id={item.id}
              content={item.content}
              praise={item.praise}
              time={item.time}
              levelId={item.levelId}
              key={item.userId + idx}
            >
              {item.list &&
                item.list.map((val: any, i: number) => {
                  return (
                    <ExampleComment
                      userName={val.userName}
                      userId={val.userId}
                      id={item.id}
                      content={val.content}
                      praise={val.praise}
                      time={val.time}
                      levelId={val.levelId}
                      parentId={val.parentId}
                      key={val.userId + idx}
                    />
                  );
                })}
            </ExampleComment>
          );
        })}
      </div>
    </div>
  );
}
