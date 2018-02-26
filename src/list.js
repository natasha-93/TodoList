import React, { Component } from 'react'
import { List, Button } from 'semantic-ui-react'
import './index.css'

const TodoList = props => {
  return (
    <List>
      {
        props.items.map(item =>
          <List.Item key={item.toString()}>
            {item}
            <Button onClick={this.deleteItem} basic color='red' compact content='X' />
          </List.Item>
        )
      }
    </List>
  )
}

export default TodoList