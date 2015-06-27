# Angular Layout Containers

Collection of angular component to build "Desktop First" web application. Following layout components are available:

- ViewPort : A LayoutContainer that fills the browser window and monitors window resizing. Viewports are best used for applications that will fill the browser without window scrolling. Children of the viewport can allow scrolling. Code snippet:

```html
<viewport>
  <border-layout border="true">
  
  </border-layout>
</viewport>

```

- BorderLayout: A multi-pane, application-oriented layout container that supports multiple regions, automatic split bars between regions and built-in expanding and collapsing of regions.
Region positions are specified using compass points (e.g. north for top, west for left, east for right, south for bottom) and center. The center region is a privileged position that receives the remaining space not allocated to other regions. Border layout containers should generally specify a center region and one or more other regions. Code snippet:

```html
<border-layout border="true">
  <west size="55" collapsed="false" split="false">
    	<!—- West Content goes here -—>
    	<div class=“westcontent”>
    	</div>
  </west>
  <east size="100" split="true">
     	<!—- East Content goes here -—>
    	<div class=“bodycontent”>
    	</div>
  </east>
  <center>
     <!-- Nested Border Layout -->
     <border-layout border="false">
        <west size="55" collapsed="false" split="false">
          	<!—- West Content goes here -—>
          	<div class=“westcontent”>
          	</div>
        </west>
        <east size="100" split="false">
           	<!—- East Content goes here -—>
          	<div class=“bodycontent”>
          	</div>
        </east>
        <center>
            <!—- Center Content goes here -—>
          	<div class=“bodycontent”>
          	</div>
        </center>
     </border-layout>
  
  </center>
</border-layout>

```
  
  
- ContentPanel: ContentPanel is a component container that has specific functionality and structural components that make it the perfect building block for application-oriented user interfaces. A content panel contains separate header, footer and body sections. The body contains a single widget. The widget is resized to match the size of the container. A content panel provides built-in expandable and collapsible behavior. Code snippet:

```html

<content-panel header-label="Direction" on-close="closeRightContent()" collapsed=“false” height="300" 
   width="300" hideButtonBar="true">
	<!—- Body goes here -—>
	<div class=“bodycontent”>
	</div>
</content-panel>

```

#Getting Started

TOOD

#Dependency

TODO

#API Doc

TODO
