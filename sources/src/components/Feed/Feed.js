// @flow
import React from 'react';
import moment from 'moment';
import { Link } from 'gatsby';
import type { Edges } from '../../types';
import styles from './Feed.module.scss';

type Props = {
  edges: Edges
};

const Feed = ({ edges }: Props) => (
  <div className={styles['feed']}>
    {edges.map((edge) => (
      <div className={styles['feed__item']} key={edge.node.slug_s}>
        <div className={styles['feed__item-meta']}>
          <time className={styles['feed__item-meta-time']} dateTime={moment(edge.node.createdDate).format('MMMM D, YYYY')}>
            {moment(Date.parse(edge.node.createdDate.split("T")[0])).format('MMMM YYYY')}
          </time>
          <span className={styles['feed__item-meta-divider']} />
          <span className={styles['feed__item-meta-category']}>
            <Link to={edge.node.category_s} className={styles['feed__item-meta-category-link']}>{edge.node.category_s}</Link>
          </span>
        </div>
        <h2 className={styles['feed__item-title']}>
          <Link className={styles['feed__item-title-link']} to={edge.node.url}>{edge.node.title_t}</Link>
        </h2>
        <p className={styles['feed__item-description']}>{edge.node.description_t}</p>
        <Link className={styles['feed__item-readmore']} to={edge.node.url}>Read</Link>
      </div>
    ))}
  </div>
);

export default Feed;
