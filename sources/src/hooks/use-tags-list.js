// @flow
import { useStaticQuery, graphql } from 'gatsby';

const useTagsList = () => {
  const { allCrafterCmsPage } = useStaticQuery(
    graphql`
      query TagsListQuery {
        allCrafterCmsPage
        #(
        #  filter: { frontmatter: { template: { eq: "post" }, draft: { ne: true } } }
        #) 
        {
        #  group(field: frontmatter___tags) {
          #  fieldValue
            totalCount
         # }
        }
      }
    `
  );

  return allCrafterCmsPage.group;
};

export default useTagsList;
