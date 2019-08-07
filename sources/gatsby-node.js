const fetch = require('node-fetch');
const path = require('path');
const pagesURL = 'http://localhost:8080/api/pages.json?crafterSite=gatsby';
const componentsURL = 'http://localhost:8080/api/components.json?crafterSite=gatsby';
const navURL = 'http://localhost:8080/api/1/site/navigation/tree.json?url=/site/website&depth=1&crafterSite=gatsby';

exports.createPages = require('./gatsby/pagination/create-categories-pages');
//exports.onCreateNode = require('./gatsby/on-create-node');

exports.sourceNodes = async ({ actions, createContentDigest}) => {
	const { createNode } = actions;

	
	const createNodesFromUrl = async (url, type, subField) => {
	
		const json = await fetch(url).then(res => res.json());
		const jsonRoot = (subField) ? json[subField] : json;

		jsonRoot.forEach((content) => {

			const nodeMeta = {
				id: content.localId,
				url:  content.url, 
				children: [],
				internal: {
					type: type,
					mediaType: `text/html`,
					content: JSON.stringify(content),
					contentDigest: createContentDigest(content),
				
				}
			};
			const node = Object.assign({}, content, nodeMeta);
			createNode(node);
		});
	};

	await createNodesFromUrl(pagesURL, 'CrafterCMSPage');
	await createNodesFromUrl(componentsURL, 'CrafterCMSComponent');
	await createNodesFromUrl(navURL, 'CrafterCMSNavigation', 'subItems');
};




exports.createPages = ({ graphql, actions }) => {
	const { createPage } = actions;

	const allCrafterCmsPageQuery = `{
			allCrafterCmsPage {
				edges {
					node {
						url
						localId
						content_type
					}
				}
			}
		}`;

	return new Promise((resolve, reject) => {
		graphql(allCrafterCmsPageQuery)
		.then(result => {

			if(!result || !result.data) {
				console.log("No pages to generate. No results.");
				return resolve();
			}

			result.data.allCrafterCmsPage.edges.forEach(({ node }) => {
					var templateName = node.content_type.replace("/page/", "");
					console.log(">>> Generating Page: (" + node.url + ")  with template ("+templateName+")");
					createPage({
						path: node.url,
						component: path.resolve(`./src/templates/`+templateName+`-template.js`),
						context: {
							url: node.localId,
						},
					});
			});
		

			resolve()
		})
		.catch(error => {
			console.log(error)
			reject()
		})
	});
};