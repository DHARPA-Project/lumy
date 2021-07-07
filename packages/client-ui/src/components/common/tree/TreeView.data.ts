import { ITreeItem } from './TreeView.types'

export const sampleTreeStructure: ITreeItem[] = [
  {
    id: 'parent-1',
    name: 'Parent 1',
    children: [
      {
        id: 'child-1.1',
        name: 'Child - 1.1',
        details:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio at ut labore dolor quo corporis voluptate modi quidem. Assumenda, totam.'
      },
      {
        id: 'child-1.2',
        name: 'Child - 1.2',
        children: [
          {
            id: 'child-1.2.1',
            name: 'Child - 1.2.1',
            details:
              'Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio at ut labore dolor quo corporis voluptate modi quidem. Assumenda, totam.'
          }
        ]
      }
    ]
  },
  {
    id: 'parent-2',
    name: 'Parent 2',
    children: [
      {
        id: 'child-2.1',
        name: 'Child - 2.1'
      },
      {
        id: 'child-2.2',
        name: 'Child - 2.2',
        children: [
          {
            id: 'child-2.2.1',
            name: 'Child - 2.2.1',
            details:
              'Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio at ut labore dolor quo corporis voluptate modi quidem. Assumenda, totam.'
          },
          {
            id: 'child-2.2.2',
            name: 'Child - 2.2.2'
          },
          {
            id: 'child-2.2.3',
            name: 'Child - 2.2.3',
            details:
              'Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio at ut labore dolor quo corporis voluptate modi quidem. Assumenda, totam.'
          }
        ]
      }
    ]
  }
]
