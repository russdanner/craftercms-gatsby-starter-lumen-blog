// @flow
import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';
import Post from '../components/Post';
import { useSiteMetadata } from '../hooks';
import type { CrafterCmsPage } from '../types';

type Props = {
  data: {
    crafterCmsPage: CrafterCmsPage
  }
};

const PostTemplate = ({ data }: Props) => {
  const { title: siteTitle, subtitle: siteSubtitle } = useSiteMetadata();
  const { title: postTitle, description: postDescription } = data.crafterCmsPage;
  const metaDescription = postDescription !== null ? postDescription : siteSubtitle;

  return (
    <Layout title={`${postTitle} - ${siteTitle}`} description={metaDescription}>
      <Post post={data.crafterCmsPage} />
    </Layout>
  );
};

export const query = graphql`
  query PostBySlug($url: String!) {
    crafterCmsPage(localId: {eq: $url}) {
      #id
      body_html
      #fields {
        slug_s
       # tagSlugs_s
      #}
      #frontmatter {
      #  date
      #  description
      #  tags
        title_t
      #}
    }
  }
`;

export default PostTemplate;
