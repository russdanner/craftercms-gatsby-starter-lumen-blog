def contentObject = [:]
def pageId = (params.id) ? params.id : "/site/website/index.xml"

def pageItem = siteItemService.getSiteItem(pageId)

contentObject.contentType = "/page/entry"
contentObject = getContentPage(pageItem.getDom(), pageId)


  /* turn a dom object in to a content map */
  def getContentPage(dom, path) {
      return getElementContent(dom.page, path)
  }
  
  /* turn a dom object in to a content map */
  def getContentComponent(dom, path) {
      return getElementContent(dom.component, path)
  }

  def getElementContent(element, path) {
  
      def content = [:]
      content.cmsId = path
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
                        //content[property.getName()].add(componentPath)

                        // code that unfurls components
                        def compomentItem = siteItemService.getSiteItem(componentPath)
                        content[property.getName()].add(getElementContent(compomentItem.dom.component, componentPath))
                       

                        
                      }
                  }
                  else {
                      content[property.getName()] = getElementContent(property, "")
                  }

          }
      }
      
      return content
  }

return contentObject