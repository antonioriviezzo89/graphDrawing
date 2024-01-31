export const graphData =  {
    nodes: [
      { data: { id: 'j', labels: 'person', properties: { comparables: "person", person: "Jerry" } } },
      { data: { id: 'e', labels: 'person', properties: { comparables: "person", person: "Elaine" } } },
      { data: { id: 'k', labels: 'person', properties: { comparables: "person", person: "Kramer" } } },
      { data: { id: 'g', labels: 'person', properties: { comparables: "person", person: "George" } } },
    ],
    edges: [
      { data: { source: 'j', target: 'e', text: 'collegato' } },
      { data: { source: 'j', target: 'k', text: 'collegato' } },
      { data: { source: 'j', target: 'g', text: 'collegato' } },
      { data: { source: 'k', target: 'e', text: 'collegato' } },
      { data: { source: 'k', target: 'g', text: 'collegato' } },
    ]
  };