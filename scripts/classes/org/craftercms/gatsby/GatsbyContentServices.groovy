package org.craftercms.gatsby


import org.apache.commons.lang3.StringUtils
import org.craftercms.engine.service.UrlTransformationService
import org.elasticsearch.action.search.SearchRequest
import org.elasticsearch.index.query.QueryBuilders
import org.elasticsearch.search.builder.SearchSourceBuilder
import org.elasticsearch.search.sort.FieldSortBuilder
import org.elasticsearch.search.sort.SortOrder

public class GatsbyContentServices {

	def siteItemService
    def getSiteItemService() { return siteItemService }
    def setSiteItemService(value) { siteItemService = value }

	def searchService
    def getSearchService() { return searchService }
    def setSearchService(value) { searchService = value }



	/**
     */
	def getPages() {

      def queryStatement = "content-type:\\/page*" 
      def result = elasticsearch.search([ query: [ query_string: [ query: queryStatement as String  ]  ]  ])
      def items = result.hits.hits*.getSourceAsMap()
      def pages = []
      
      items.each { item ->
          def cmsPage = [:]
          def siteItem = siteItemService.getSiteItem(item.localId)
              
          cmsPage = getContentPage(siteItem.getDom())
          cmsPage.localId = item.localId
          cmsPage.url = item.localId.replace("/site/website","").replace("/index.xml", "")
          if("".equals(cmsPage.url)) cmsPage.url = "/"
          
          pages.add(cmsPage)
      }

        return pages
	}	

  /**
   */
  def getComponents() {

    return []
  } 

  /* turn a dom object in to a content map */
  def getContentPage(dom) {
      return getElementContent(dom.page)
  }
  
  /* turn a dom object in to a content map */
  def getContentComponent(dom) {
      return getElementContent(dom.component)
  }

  def getElementContent(element) {
  
      def content = [:]
      
      element.elements().each { property ->
      
          if(property.isTextOnly()) {
              // element is a property
              content[property.getName()] = property.getText()
          }
          else {
             
                  // item is a repeat group (recursive)
                  if("item".equals(property.getName())) {
                      if(!content[property.getName()]) {
                          // init the array
                          content[property.getName()] = []
                      }
                      
                      def include = property.selectNodes("./include");
                      if(include.size() == 0) {
                        // repeat group
                        content[property.getName()].add(getElementContent(property))
                      }
                      else {
                        // component
                        def componentPath = include[0].getText();
                        content[property.getName()].add(componentPath)
                      }
                  }
                  else {
                      content[property.getName()] = getElementContent(property)
                  }
          }
      }
      
      return content
  }
  
}