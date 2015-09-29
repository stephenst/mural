---
name: Tabs
description: |
    ### What
    Puts content modules into a tabbed area so that only one module is visible at a time. The user clicks on different tabs to bring different modules on top.
    ### Use when
    Content can be grouped into different modules and these modules are mutually exclusive. There should not be more than four modules.
    
    ### Example
    ````
        <tabs class="subtabs">
            <pane heading="{{item.name}}" ng-repeat="item in items">
                Content
            </pane>
        </tabs>
        
        <div class="tabs subtabs">
            <ul class="tabs-nav">
                <li class="tab active">
                    <a>Feeds</a>
                </li>
                <li class="tab">
                    <a>Catalog</a>
                </li>
            </ul>
            <div class="tab-content">
                <div class="tab-pane active"></div>
            </div>   
        </div>
    ````
---
<tabs class="subtabs">
    <pane heading="{{item.name}}" ng-repeat="item in items">
        Content
    </pane>
</tabs>

<div class="tabs subtabs">
    <ul class="tabs-nav">
        <li class="tab active">
            <a>Feeds</a>
        </li>
        <li class="tab">
            <a>Catalog</a>
        </li>
    </ul>
    <div class="tab-content">
        <div class="tab-pane active"></div>
    </div>   
</div>
