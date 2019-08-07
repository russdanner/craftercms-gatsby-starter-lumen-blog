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

const CategoryTemplate = ({ data, pageContext }: Props) => {
  const { title: siteTitle, subtitle: siteSubtitle } = useSiteMetadata();

  const {
    category,
    currentPage,
    prevPagePath,
    nextPagePath,
    hasPrevPage,
    hasNextPage,
  } = pageContext;

  const { edges } = data.allCrafterCmsPage;
  const pageTitle = currentPage > 0 ? `${category} - Page ${currentPage} - ${siteTitle}` : `${category} - ${siteTitle}`;

  return (
    <Layout title={pageTitle} description={siteSubtitle}>
      <Sidebar />
      <Page title={category}>
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
  query CategoryPage {
    #($category: String, $postsLimit: Int!, $postsOffset: Int!) {
    allCrafterCmsPage{
      #(
      #  limit: $postsLimit,
      #  skip: $postsOffset,
      #  filter: { frontmatter: { category: { eq: $category }, template: { eq: "post" }, draft: { ne: true } } },
      #  sort: { order: DESC, fields: [frontmatter___date] }
      #)
      #{
      edges {
        node {
            categorySlug_s
            slug_s
            createdDate
            description_t
            category_s
            title_t
        }
      }
    }
  }
`;

export default CategoryTemplate;
