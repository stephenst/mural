---
name: Tabs box
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
