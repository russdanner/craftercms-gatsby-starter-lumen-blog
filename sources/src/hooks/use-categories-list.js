// @flow
import { useStaticQuery, graphql } from 'gatsby';

const useCategoriesList = () => {
  const { allCrafterCmsPage } = useStaticQuery(
    graphql`
      query CategoriesListQuery {
        allCrafterCmsPage
        #(
        #  filter: { frontmatter: { template: { eq: "post" }, draft: { ne: true } } }
        #) 
        {
        #  group(field: frontmatter___category) {
            #fieldValue
            totalCount
         # }
        }
      }
    `
  );

  return allCrafterCmsPage.group;
};

export default useCategoriesList;
