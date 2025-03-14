import moment from 'moment';
import numeral from 'numeral';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { AiFillEye } from 'react-icons/ai';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useHistory } from 'react-router-dom';

import request from '../../api';
import './_video.scss';

const Video = ({ video, channelScreen }) => {
  const {
    id,
    snippet: {
      channelId,
      channelTitle,
      title,
      publishedAt,
      thumbnails: { medium },
    },
    contentDetails,
  } = video;

  const [views, setViews] = useState(null);
  const [duration, setDuration] = useState(null);
  const [channelIcon, setChannelIcon] = useState(null);

  const seconds = moment.duration(duration).asSeconds();
  const _duration = moment.utc(seconds * 1000).format('mm:ss');

  const _videoId = id?.videoId || contentDetails?.videoId || id;
  const history = useHistory();

  useEffect(() => {
    const get_video_details = async () => {
      const {
        data: { items },
      } = await request.get('/videos', {
        params: {
          part: 'contentDetails,statistics',
          id: _videoId,
        },
      });
      // console.log(items);

      setDuration(items[0].contentDetails.duration);
      setViews(items[0].statistics.viewCount);
    };
    get_video_details();
  }, [_videoId]);

  useEffect(() => {
    const get_channel_icon = async () => {
      const {
        data: { items },
      } = await request.get('/channels', {
        params: {
          part: 'snippet',
          id: channelId,
        },
      });
      // console.log(items);

      setChannelIcon(items[0].snippet.thumbnails.default.url);
    };
    get_channel_icon();
  }, [channelId]);

  const handleVideoClick = () => {
    history.push(`watch/${_videoId}`);
  };

  return (
    <div className="video" onClick={handleVideoClick}>
      <div className="video__top">
        <LazyLoadImage src={medium.url} effect="blur" />
        {/* <img src={medium.url} alt="thumbnail" /> */}
        <span className="video__top__duration">{_duration}</span>
      </div>
      <div className="video__title">{title}</div>
      <div className="video__details">
        <span>
          <AiFillEye /> {numeral(views).format('0.a')} views •
          <span> {moment(publishedAt).fromNow()}</span>
        </span>
      </div>
      {!channelScreen && (
        <div className="video__channel">
          <LazyLoadImage src={channelIcon} effect="blur" />
          {/* <img src={channelIcon} alt="channel" /> */}
          <p>{channelTitle}</p>
        </div>
      )}
    </div>
  );
};

export default Video;
