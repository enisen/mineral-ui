/* @flow */
import { Component } from 'react';

import type {
  Sort,
  SortableProps,
  SortableState,
  SortComparator,
  SortFn
} from './types';

const normalizedValue = (value) =>
  value === null || value === undefined
    ? ''
    : typeof value === 'string'
      ? value.toUpperCase()
      : value;

export const defaultSortComparator: SortComparator = (a, b, key) => {
  const valueA = normalizedValue(a[key]);
  const valueB = normalizedValue(b[key]);

  return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
};

export default class Sortable extends Component<SortableProps, SortableState> {
  static displayName = 'Sortable';

  static defaultProps = {
    sortComparator: defaultSortComparator
  };

  state = {
    sort: this.props.defaultSort
  };

  render() {
    const sort = this.getControllableValue('sort');
    const isControlled = this.isControlled('sort');

    const props = {
      ...this.props,
      sortable: {
        data: sort && !isControlled ? this.sortData() : this.props.data,
        sort,
        sortFn: this.sort
      }
    };

    return this.props.children(props);
  }

  sort: SortFn = (sort) => {
    if (this.isControlled('sort')) {
      this.sortActions(sort);
    } else {
      this.setState(
        {
          sort
        },
        () => {
          this.sortActions(sort);
        }
      );
    }
  };

  sortActions = (sort: Sort) => {
    const { onSort } = this.props;
    onSort && onSort(sort);
  };

  sortData = () => {
    const { comparators, data } = this.props;
    const sort = this.getControllableValue('sort');

    const sortComparator =
      (comparators && comparators[sort.key]) || this.props.sortComparator;

    return data.slice(0).sort((a, b) => {
      const asc = sortComparator(a, b, sort.key);
      const desc = asc * -1;
      return sort.descending ? desc : asc;
    });
  };

  isControlled = (prop: string) => {
    return this.props.hasOwnProperty(prop);
  };

  getControllableValue = (key: string) => {
    return this.isControlled(key) ? this.props[key] : this.state[key];
  };
}
