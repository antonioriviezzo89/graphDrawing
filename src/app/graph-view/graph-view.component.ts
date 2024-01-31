import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { graphData } from './graphDataset';
import cytoscape from 'cytoscape';
import cxtmenu from 'cytoscape-cxtmenu';
import edgehandles from 'cytoscape-edgehandles';
import cola from 'cytoscape-cola';
import { ColorGenService } from '../services/color-gen.service';

cytoscape.use(cxtmenu);
cytoscape.use(cola);
cytoscape.use(edgehandles);

@Component({
  selector: 'app-graph-view',
  templateUrl: './graph-view.component.html',
  styleUrls: ['./graph-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ColorGenService]
})
export class GraphViewComponent implements OnInit, OnDestroy {

  public graphData: any;

  public cy: any; //cytoscape.Core = <cytoscape.Core>{};
  private layout: any;
  private idCy = null;
  public eh: any;

  constructor(public colorGen: ColorGenService) {
    this.graphData = graphData;
  }

  ngOnInit(): void {
    this.configGraph();
  }

  ngOnDestroy(): void {
    this.cy.destroy();
  }


  drawOn() {
    this.eh.enableDrawMode();
  }

  drawOff() {
    this.eh.disableDrawMode();
  }

  configGraph() {

    this.cy = <cytoscape.Core>{};
    this.createNodeCy();

    this.layout = {
      ready: (e) => {
        e.cy.fit();
        e.cy.center();
        //this._fuseLoadingService.show(); 
      },
      stop: () => {
        //this._fuseLoadingService.hide() 
      },
      name: "cola",
      handleDisconnected: true,
      randomize: false,
      animate: true,
      refresh: 2, // number of ticks per frame; higher is faster but more jerky
      maxSimulationTime: 2500,
      padding: 30,
      avoidOverlap: true,
      centerGraph: true,
      unconstrIter: 1,
      userConstIter: 0,
      allConstIter: 1,
      edgeLength: 50, // sets edge length directly in simulation
    }


    /*
    this.layout = {
      ready: () => { this._fuseLoadingService.show() },
      stop: () => { this._fuseLoadingService.hide() },
      name: 'cose', // grid, circle, cose, cola
      animate: true,
      fit: true,
      numIter: 500,
      refresh: 25,
      nodeOverlap: 50, 
    }; 
    */

    this.cy = cytoscape({
      container: document.getElementById(this.idCy),
      elements: this.graphData,
      style: this.showAllStyle, // the stylesheet for the graph,s
      layout: this.layout,
      boxSelectionEnabled: true,
      wheelSensitivity: 0.25,
    });

    

    // Changeing cursor style on differet elements
    this.cy.on('mouseover', 'node, edge', (event: any) => {
      var selected = event.target;
      if (event.cy.container()) {
        event.cy.container().style.cursor = 'pointer';
      }

      if (selected.isNode()) {
        selected.style('background-opacity', 0.4);
        /*
        if(this.graphElementSelected) {        
          this.graphElementSelected = selected;
        }
        */
      }
    });

    this.cy.on('mouseout', 'node, edge', (event: any) => {
      var selected = event.target;
      if (event.cy.container()) {
        event.cy.container().style.cursor = 'grab';
      }

      if (selected.isNode()) {
        selected.style('background-opacity', 1);
      }
    });

    this.cy.on('grab', (event: any) => {
      if (event.cy.container()) {
        event.cy.container().style.cursor = 'grabbing';
      }
    });

    this.cy.on('free', 'node, edge', (event: any) => {
      if (event.cy.container()) {
        event.cy.container().style.cursor = 'pointer';
      }
    });

    this.eh = this.cy.edgehandles({ snap: false }); 

    this.cy.on('cxttap', 'node', (event: any) => {
      if(!this.eh.drawMode) {
        this.drawOn();
        this.eh.start(event.target)
      } else {
        this.eh.stop();
      }
    });

    this.cy.on('ehcomplete', (event, sourceNode, targetNode, addedEdge) => {
      console.log(sourceNode);
      console.log(targetNode);   
      /*
      let sourceId = sourceNode._private.data.id;
      let targetId = targetNode._private.data.id;
      var createdEdge  = { data: { source: sourceId, target: targetId, text: '' } };
      let existsEdges = (this.graphData.edges as Array<any>).filter( i => i.data.source == createdEdge.data.source && i.data.target == createdEdge.data.target);
      
      if(existsEdges.length > 0) {
        console.log(existsEdges);
      } else {

      }
      */
      this.drawOff();
    });

    //cytoscape.use(cxtmenu);
    this.cy.cxtmenu({
      menuRadius: 50,
      selector: 'node',
      commands: [
        {
          content: `<span class="material-symbols-outlined">conversion_path</span>`,
          select: (node: any) => {
            //this.graphViewService.expandNode(node.id());                           
          },
          enabled: true
        },
        {
          content: '<span class="material-icons">info</span>',
          select: (node: any) => {
            //this.graphElementSelected = node;
          },
          enabled: true
        },

      ],
      fillColor: 'rgba(0, 0, 0, 0.25)',
      activeFillColor: 'rgba(0, 0, 0, 0.50)',
      activePadding: 5,
      adaptativeNodeSpotlightRadius: true,
      indicatorSize: 0,
      //separatorWidth: 3,
      //spotlightPadding: 0,
      //adaptativeNodeSpotlightRadius: false, 
      openMenuEvents: 'onetap',
      outsideMenuCancel: 10,
      //minSpotlightRadius: 24,
      //maxSpotlightRadius: 38, 
    }
    );

    this.cy.minZoom(0.3);
    this.cy.maxZoom(6);

    //this.graph = this.graphData;
    this.cy.elements().remove();
    this.cy.add(this.graphData);

    this.cy.layout(this.layout).run();
  }

  makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  createNodeCy() {
    let cy = document.createElement('div');
    this.idCy = 'cy_' + this.makeid(16);
    cy.id = this.idCy;
    cy.className = 'graph-background';
    let container = document.getElementById('container_cy');
    container.appendChild(cy);
  }


  public showAllStyle: cytoscape.Stylesheet[] = [ // the stylesheet for the graph
    {   // Stile dei nodi
      selector: 'node',
      style: {
        // Testo
        'label': (node: any) => {
          try {
            let nodeTypes = node._private.data.properties.comparables;
            let nodeDetails = node._private.data.properties[nodeTypes];
            //let nodeDetails = node._private.data.labels;
            return nodeDetails;
          } catch {
            return "";
          }
        },
        'text-wrap': 'wrap',
        'color': (node: any) => {
          //return this.colorGen.getLabelC(node._private.data.labels[0]);
          return this.colorGen.getLabelC(node._private.data.labels);
        },

        'font-size': 4,
        "text-halign": 'center',
        "text-valign": "top",
        // Grafica del testo
        'text-margin-y': -2.5,
        'text-background-shape': 'roundrectangle',
        'text-background-padding': '1px',
        "text-background-color": (node: any) => {

          try {
            //return this.colorGen.getLabelBC(node._private.data.labels[0]);
            return this.colorGen.getLabelBC(node._private.data.labels);
          } catch {
            return this.colorGen.getLabelBC("");
          }

        },
        'text-background-opacity': 1,

        // Grafica del nodo
        'background-color': (node: any) => {
          try {
            //return this.colorGen.getLabelBC(node._private.data.labels[0]);
            return this.colorGen.getLabelBC(node._private.data.labels);
          } catch {
            return this.colorGen.getLabelBC("");
          }

        },
        'background-fit': 'cover',
        'border-color': 'gray', /* (node: any) => {
        //return this.colorGen.getNodeBorder(node._private.data.labels[0]);
        return this.colorGen.getNodeBorder(node._private.data.labels);
      },*/
        'border-width': 0.4,
        'width': (node: any) => {
          return this.getNodeWeight(node);
        },
        'height': (node: any) => {
          return this.getNodeWeight(node);
        }
      },
    },
    {   // Stile dei nodi selezionati
      selector: 'node:selected',
      style: {
        'background-opacity': 0.3,
        'border-opacity': 0.7
      }
    },
    {   // Stile degli archi
      selector: 'edge',
      style: {
        'label': (data: any) => {
          return data._private.data.properties?.count ? (data._private.data.properties.count) : data._private.data.text;
        },
        'font-size': 3,
        // 'width': (data:any) => { return data._private.data.properties.count ? 0.2 * (data._private.data.properties.count) : 0.2; },
        'width': 0.2,
        'line-color': 'gray',
        'curve-style': 'bezier',
        'text-rotation': 'autorotate',
        'color': '#000000',
        'text-background-color': 'white',
        'text-background-opacity': 1,
        'text-background-padding': '2px',
        'text-justification': 'auto',
        'text-valign': 'center',
      },
    },
    {   // Stile degli archi selezionati
      selector: 'edge:selected',
      style: {
        'label': (data: any) => {
          return data._private.data.properties?.count ? (data._private.data.properties.count) : data._private.data.text;
        }, 
        'line-color': 'red'
      }
    },

    // some style for the extension for link creation    
    {
      selector: '.eh-handle',
      style: {
        'label': (node: any) => {
          try {
            let nodeTypes = node._private.data.properties.comparables;
            let nodeDetails = node._private.data.properties[nodeTypes];
            return nodeDetails;
          } catch {
            return "";
          }
        },
        'background-color': 'red',
        'width': 12,
        'height': 12,
        'shape': 'ellipse',
        'overlay-opacity': 0,
        'border-width': 1, // makes the handle easier to hit
        'border-opacity': 0
      }
    },
    

    /*
    {
      selector: '.eh-hover',
      style: {
        'background-color': 'red'
      }
    },
    */

    {
      selector: '.eh-source',
      style: {
        'label': (node: any) => {
          try {
            let nodeTypes = node._private.data.properties.comparables;
            let nodeDetails = node._private.data.properties[nodeTypes];
            return nodeDetails;
          } catch {
            return "";
          }
        },
        'border-width': '1px',
        'border-color': 'green'
      }
    },

    {
      selector: '.eh-target',
      style: {
        'label': (node: any) => {
          try {
            let nodeTypes = node._private.data.properties.comparables;
            let nodeDetails = node._private.data.properties[nodeTypes];
            return nodeDetails;
          } catch {
            return "";
          }
        },
        'border-width': 1,
        'border-color': 'blue'
      }
    },

    {
      selector: '.eh-preview, .eh-ghost-edge',
      style: { 
        'background-color': 'red',
        'line-color': 'red',
        'target-arrow-color': 'red',
        'source-arrow-color': 'red'
      }
    },

    {
      selector: '.eh-ghost-edge.eh-preview-active',
      style: { 
        'opacity': 0
      }
    }

  ];

  getNodeWeight(node: any) {

    /*
    let degree = 0;    
    node._private.edges.forEach(element => {
      if ("count" in element._private.data.properties) {
        degree += element._private.data.properties.count;
      }
    });
    */

    return 10;
    // return Math.min(Math.max(10, degree * 2), 50);

  }

}
