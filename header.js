const header = () => (`
<nav class="navbar navbar-expand-lg navbar-light bg-light" >
        <div style="margin-left:100px">
        <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
          <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
            <li class="nav-item active">
              <a class="nav-link" href="../index.html">Home </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="../bar_chart/bar_chart.html">Bar Chat</a>
            </li>
            <li class="nav-item">
            <a class="nav-link" href="../scatterplot_graph/scatterplot_graph.html">Scatter Plot</a>
          </li>
          <li class="nav-item">
          <a class="nav-link" href="../heat_map/heat_map.html">Heat Map</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="../choropleth_map/choropleth_map.html">Choropleth Map</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="../tree_map/tree_map.html">Tree Map</a>
        </li>
          </ul>
        </div>
        </div>
      </nav>
`)
$('body').append(header)