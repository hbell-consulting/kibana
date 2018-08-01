/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';

import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiHeader,
  EuiHeaderLogo,
  EuiHeaderSection,
  EuiHeaderSectionItem,
  EuiHeaderSectionItemButton,
  EuiIcon,
  EuiPage,
  EuiPageBody,
} from '@elastic/eui';
import { match } from 'react-router-dom';

import { kfetch } from 'ui/kfetch';

import { FileTree as Tree } from '../../../model';

import { Breadcrumbs } from '../breadcrumbs/breadcrumbs';
import { FileTree } from '../file_tree/file_tree';
import { Editor } from './editor';

import { history } from '../../utils/url';

interface State {
  children: any[];
  forceOpenPaths: Set<string>;
  node: any;
}
interface Props {
  match: match<{ [key: string]: string }>;
}

export class Layout extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      children: [],
      node: null,
      forceOpenPaths: new Set([props.match.params.path || '']),
    };
  }

  public componentDidMount() {
    this.fetchTree('').then(() => {
      const pathSegments = (this.props.match.params.path || '').split('/');
      const pathsLength = pathSegments.length;
      if (pathsLength > 0) {
        this.fetchTree(pathSegments[0], pathsLength);
      }
    });
  }

  public onClick = (path: string) => {
    const { resource, org, repo, revision } = this.props.match.params;
    history.push(`/${resource}/${org}/${repo}/${revision}/${path}`);
  };

  public fetchTree(path: string, depth: number = 1) {
    const { resource, org, repo, revision } = this.props.match.params;
    return kfetch({
      pathname: `../api/cs/repo/${resource}/${org}/${repo}/tree/${revision}/${path}`,
      query: { depth },
    }).then((json: any) => {
      this.updateTree(path, json);
    });
  }

  public findNode = (pathSegments: string[], node: Tree) => {
    if (pathSegments.length === 0) {
      return node;
    } else if (pathSegments.length === 1) {
      return node.children.find(n => n.name === pathSegments[0]);
    } else {
      const currentFolder = pathSegments.shift();
      return this.findNode(pathSegments, node.children.find(n => n.name === currentFolder));
    }
  };

  public updateTree = (path: string, tree: Tree) => {
    if (!path) {
      this.setState({ node: tree });
    } else {
      const node = this.findNode(path.split('/'), this.state.node);
      node.children = tree.children;
      this.forceUpdate();
    }
  };

  public getTreeToggler = (path: string) => e => {
    e.preventDefault();
    e.stopPropagation();
    if (this.state.forceOpenPaths.has(path)) {
      this.state.forceOpenPaths.delete(path);
      this.forceUpdate();
    } else {
      this.fetchTree(path);
      this.state.forceOpenPaths.add(path);
      this.forceUpdate();
    }
  };

  public getDirectories = (pathSegments: string[]) => {
    return pathSegments.map((p, index) => {
      if (this.state.node) {
        const node = this.findNode(pathSegments.slice(0, index + 1), this.state.node);
        if (node && node.children) {
          return node.children.map(_ => _.name);
        } else {
          return [];
        }
      } else {
        return [];
      }
    });
  };

  public render() {
    const { resource, org, repo, revision, path } = this.props.match.params;
    const pathSegments = path ? path.split('/') : [];
    const editor = path && (
      <Editor file={path} repoUri={`${resource}/${org}/${repo}`} revision={revision || 'HEAD'} />
    );

    return (
      <EuiPage>
        <EuiPageBody>
          <EuiHeader>
            <EuiHeaderSection>
              <EuiHeaderSectionItem border="right">
                <EuiHeaderLogo>Code Browsing</EuiHeaderLogo>
              </EuiHeaderSectionItem>
            </EuiHeaderSection>

            <EuiHeaderSection side="right">
              <EuiHeaderSectionItemButton aria-label="Search">
                <EuiIcon type="search" size="m" />
              </EuiHeaderSectionItemButton>
            </EuiHeaderSection>
          </EuiHeader>
          <Breadcrumbs
            basePath={`/${resource}/${org}/${repo}/${revision}/`}
            pathSegments={pathSegments}
            directories={this.getDirectories(pathSegments)}
          />
          <EuiFlexGroup>
            <EuiFlexItem style={{ maxWidth: 300 }}>
              <FileTree
                node={this.state.node}
                onClick={this.onClick}
                forceOpenPaths={this.state.forceOpenPaths}
                getTreeToggler={this.getTreeToggler}
                activePath={path || ''}
              />
            </EuiFlexItem>

            <EuiFlexItem>{editor}</EuiFlexItem>
          </EuiFlexGroup>
        </EuiPageBody>
      </EuiPage>
    );
  }
}
