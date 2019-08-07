// @flow
import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import Page from '../components/Page';
import { useSiteMetadata } from '../hooks';
import type { CrafterCmsPage } from '../types';

type Props = {
  data: {
    crafterCmsPage: CrafterCmsPage
  }
};

const PageTemplate = ({ data }: Props) => {
  const { title: siteTitle, subtitle: siteSubtitle } = useSiteMetadata();
  const { html: pageBody } = data.crafterCmsPage;
  const { title: pageTitle, description: pageDescription } = data.crafterCmsPage;
  const metaDescription = pageDescription !== null ? pageDescription : siteSubtitle;

  return (
    <Layout title={`${data.crafterCmsPage.title_t} - ${siteTitle}`} description={metaDescription}>
      <Sidebar />
      <Page title={pageTitle}>
        <div dangerouslySetInnerHTML={{ __html: data.crafterCmsPage.body_html }} />
      </Page>
    </Layout>
  );
};

export const query = graphql`
  query PageBySlug($url: String!) {
    crafterCmsPage(localId: {eq: $url}) {
      id
      body_html
      title_t
      createdDate
      description_t
    }
  }
`;

export default PageTemplate;
