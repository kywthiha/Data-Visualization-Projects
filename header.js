const header = ()=>(`
<nav class="navbar navbar-expand-lg navbar-light bg-light" >
        <div style="margin-left:100px">
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
          <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
            <li class="nav-item active">
              <a class="nav-link" href="index.html">Home </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="bar_chart.html">Bar Chat</a>
            </li>
            <li class="nav-item">
            <a class="nav-link" href="scatterplot_graph.html">Scatter Plot</a>
          </li>
          <li class="nav-item">
          <a class="nav-link" href="heat_map.html">Heat Map</a>
        </li>
          </ul>
        </div>
        </div>
      </nav>
`)

$('body').append(header)