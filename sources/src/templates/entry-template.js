// @flow
import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import Feed from '../components/Feed';
import Page from '../components/Page';
import Pagination from '../components/Pagination';
import { useSiteMetadata } from '../hooks';
import type { PageContext, AllCrafterCmsPage } from '../types';

type Props = {
  data: AllCrafterCmsPage,
  pageContext: PageContext
};

const IndexTemplate = ({ data, pageContext }: Props) => {
  const { title: siteTitle, subtitle: siteSubtitle } = useSiteMetadata();

  const {
    currentPage,
    hasNextPage,
    hasPrevPage,
    prevPagePath,
    nextPagePath
  } = pageContext;


  const { edges } = data.allCrafterCmsPage;
  const pageTitle = currentPage > 0 ? `Posts - Page ${currentPage} - ${siteTitle}` : siteTitle;

  return (
    <Layout title={pageTitle} description={siteSubtitle}>
      <Sidebar isIndex />
      <Page>
        <Feed edges={edges} />
        <Pagination
          prevPagePath={prevPagePath}
          nextPagePath={nextPagePath}
          hasPrevPage={hasPrevPage}
          hasNextPage={hasNextPage}
        />
      </Page>
    </Layout>
  );
};

export const query = graphql`
#  query IndexTemplate($postsLimit: Int!, $postsOffset: Int!) {
#    allCrafterCmsPage(limit: $postsLimit, skip: $postsOffset, filter:{content_type: { eq: "/page/post"} }) {
  query IndexTemplate  {
    allCrafterCmsPage( filter:{content_type: { eq: "/page/post"} }) {
      edges {
        node {
            slug_s
            categorySlug_s
            title_t
            createdDate
            category_s
            description_t
            url
        }
      }
    }
  }
`;

export default IndexTemplate;
