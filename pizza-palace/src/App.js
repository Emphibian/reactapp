import React from "react";
import "./App.css";
import discord from "./content/pictures/discord.png";
import insta from "./content/pictures/instagram.png";
import twit from "./content/pictures/twitter.png";
import locat from "./content/pictures/Location.png";

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = { page: "Home" };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(page) {
    this.setState({ page: page });
  }

  render() {
    return (
      <>
        <HeaderTop onChange={this.handleChange} />
        <Container page={this.state.page} />
        <FooterBot />
      </>
    );
  }
}

class Container extends React.Component {
  render() {
    if (this.props.page === "Home") {
      return <Home />;
    } else if (this.props.page === "Visit") {
      return <Visit />;
    } else if (this.props.page === "Menu") {
      return <Menu />;
    } else if (this.props.page === "Reservation") {
      return <Reservation />;
    }
  }
}

class Visit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      normal_tables: [],
      outdoor_tables: [],
      lounge_tables: [],
    };
  }

  componentDidMount() {
    fetch("/tables/normal")
      .then((res) => res.json())
      .then((data) => this.setState({ normal_tables: data }));

    fetch("/tables/outdoor")
      .then((res) => res.json())
      .then((data) => this.setState({ outdoor_tables: data }));

    fetch("/tables/lounge")
      .then((res) => res.json())
      .then((data) => this.setState({ lounge_tables: data }));
  }

  render_cell(props) {
    if (props.row.booked) {
      return (
        <div className="visit-cell cell-gray">Table no. {props.index + 1}</div>
      );
    } else {
      return (
        <div className="visit-cell cell-green">Table no. {props.index + 1}</div>
      );
    }
  }

  render() {
    return (
      <div className="visit-area">
        <div className="visit-table">
          <div className="table-top-grid">Normal Tables</div>
          {this.state.normal_tables.map((row, index) =>
            this.render_cell({ row, index })
          )}
        </div>
        <div className="visit-table">
          <div className="table-top-grid">Outdoor Tables</div>
          {this.state.outdoor_tables.map((row, index) =>
            this.render_cell({ row, index })
          )}
        </div>
        <div className="visit-table">
          <div className="table-top-grid">Lounge Tables</div>
          {this.state.lounge_tables.map((row, index) =>
            this.render_cell({ row, index })
          )}
        </div>
      </div>
    );
  }
}

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      is_focused: false,
      menu: [],
    };
    this.info = {};
  }

  componentDidMount() {
    fetch("/users")
      .then((res) => res.json())
      .then((data) => this.setState({ menu: data }));
  }

  render_elements() {
    return (
      <>
        {this.state.menu.map((row) => (
          <MenuEle
            title={row.title}
            description={row.description}
            image="https://via.placeholder.com/640x360/"
            onClick={() => this.handleClick(row)}
          />
        ))}
      </>
    );
  }

  handleClick(info) {
    this.info = {
      title: info.title,
      description: info.description,
      image: "https://via.placeholder.com/640x360/",
    };
    this.setState({ is_focused: true });
  }

  exit() {
    this.setState({ is_focused: false });
  }

  render() {
    if (this.state.is_focused) {
      return (
        <div className="Menu">
          {this.render_elements()}
          <MenuEleFocused info={this.info} exit={() => this.exit()} />
        </div>
      );
    } else {
      return <div className="Menu">{this.render_elements()}</div>;
    }
  }
}

class MenuEle extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="MenuEle" onClick={() => this.props.onClick()}>
        <h3>{this.props.title}</h3>
        <p>{this.props.description}</p>
      </div>
    );
  }
}

function MenuEleFocused(props) {
  return (
    <div className="MenuEle-focused">
      <div className="focused-detail">
        <div className="focused-image">
          <img src={props.info.image} alt={props.info.title} />
        </div>
        <div className="focused-description">
          <h3>{props.info.title}</h3>
          <p>{props.info.description}</p>
        </div>
      </div>
      <button className="exit" onClick={() => props.exit()}>
        Exit
      </button>
    </div>
  );
}

class Reservation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded_type: "",
      bookedTables: [],
    };

    // binding the context
    this.handleChange = this.handleChange.bind(this);
    this.handleInsertBooking = this.handleInsertBooking.bind(this);
    this.cleanBookedTables = this.cleanBookedTables.bind(this);
    this.handleRemoveBooking = this.handleRemoveBooking.bind(this);
  }

  handleChange(event) {
    this.setState({ loaded_type: event.target.value });
  }

  handleInsertBooking(info) {
    this.setState({
      bookedTables: [...this.state.bookedTables, {table_num: info.table_num, table_type: info.table_type}]
    });
  }
  
  handleRemoveBooking(info) {
    this.setState({
      bookedTables: this.state.bookedTables.filter((table_obj) => table_obj.table_num !== info.table_num || table_obj.table_type !== info.table_type)
    });
  }

  cleanBookedTables() {
    this.setState({
      bookedTables: [],
    });
  }

  render() {
    return (
      <main>
        <div className="reservation-selection-div">
          <div className="left-selection-div">
            <select value={this.state.loaded_type} onChange={this.handleChange} name="tables" id="tables">
              <option value="Not Important">Please select the type of the tables</option>
              <option value="Normal">Normal</option>
              <option value="Lounge">Lounge</option>
              <option value="Outdoor">Outdoor</option>
            </select>
            <div className="booked-table-brd">
              <h2>Booked Tables</h2>
            </div>
            <BookedQueue bookedTables={this.state.bookedTables} />
          </div>
          <div className="right-selection-div">
            <div className="reservation-table-layout">
              <img src={locat} />
            </div>
            <TablesLoader
              handleInsertBooking={this.handleInsertBooking}
              handleRemoveBooking={this.handleRemoveBooking}
              loaded_type={this.state.loaded_type}
              bookedTables={this.state.bookedTables} />
          </div>
        </div>
        <button onClick={() => this.cleanBookedTables()}>Clear</button>
        <Confirm bookedTables={this.state.bookedTables} cleanBookedTables={this.cleanBookedTables}/>
        <button onClick={() => fetch("/tables/reset")}>Reset</button>
      </main>
    );
  }
}

function Confirm(props) {
  return (
    <button onClick={() => {props.bookedTables.map((info) => fetch("/tables/update", {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        table_type: info.table_type,
        table_num: info.table_num,
      }),
    })); props.cleanBookedTables();}}>Confirm</button>
  );
}

class BookedQueue extends React.Component {
 render_cell(info) {
    return (
    <div className='reservation-booked-cell'>
      {`${info.table_type} Table No. ${info.table_num}`}
    </div>
    );
  }

  render() {
    return (
    <div className="reservation-booked-grid">
      {this.props.bookedTables.map((info) => this.render_cell(info))}
    </div>
    );
  }
}

class TablesLoader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      normal_tables: [],
      outdoor_tables: [],
      lounge_tables: [],
    };
  }

  componentDidMount() {
    fetch("/tables/normal")
      .then((res) => res.json())
      .then((data) => this.setState({ normal_tables: data }));

    fetch("/tables/outdoor")
      .then((res) => res.json())
      .then((data) => this.setState({ outdoor_tables: data }));

    fetch("/tables/lounge")
      .then((res) => res.json())
      .then((data) => this.setState({ lounge_tables: data }));
  }

  selection() {
    if (this.props.loaded_type === "Normal") {
      return (
        this.state.normal_tables.map((row, index) => this.render_cell({ row, index }))
      );
    } else if (this.props.loaded_type === "Outdoor") {
      return (
        this.state.outdoor_tables.map((row, index) => this.render_cell({ row, index }))
      );
    } else if (this.props.loaded_type === "Lounge") {
      return(
        this.state.lounge_tables.map((row, index) => this.render_cell({ row, index }))
      );
    }
  }

  render_cell(props) {
    if (props.row.booked) {
      return (
        <div className="reservation-tables-cell cell-gray">
            Table no. {props.index + 1}
        </div>
      );
    } else if (this.props.bookedTables.filter((info) => info.table_num===props.index+1 && info.table_type===this.props.loaded_type)[0]) {
      return (
        <div className="reservation-tables-cell cell-red" onClick={() => this.props.handleRemoveBooking({
            table_num: props.index + 1,
            table_type: this.props.loaded_type
          })}>
          Table no. {props.index + 1}
        </div>
      );
    } else {
      return (
        <div className="reservation-tables-cell cell-green" onClick={() => this.props.handleInsertBooking({
              table_num: props.index + 1,
              table_type: this.props.loaded_type
            })}>
            Table no. {props.index + 1}
        </div>
      );
    }
  }

  render() {
    return (
      <div className="reservation-tables-grid">
        {this.selection()}
      </div>
    );
  }
}

function HeaderTop(props) {
  return (
    <div className="header">
      <div className="header-title">
        <button type="button" onClick={() => props.onChange("Home")}>
          Pizza Palace
        </button>
      </div>
      <div className="header-nav">
        <ul>
          <li>
            <button type="button" onClick={() => props.onChange("Visit")}>
              Visit
            </button>
          </li>
          <li>
            <button type="button" onClick={() => props.onChange("Menu")}>
              Menu
            </button>
          </li>
          <li>
            <button type="button" onClick={() => props.onChange("Reservation")}>
              Reservation
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

function FooterBot() {
  return (
    <div className="footer">
      <div className="contact">
        <h3 className="mr5">Contacts</h3>
        <ul>
          <li>Emphibian</li>
          <li>Kakkarot0</li>
        </ul>
      </div>
      <div className="socials">
        <h3 className="mr5">Social</h3>
        <ul>
          <li>
            <img src={discord} alt="discord" />
          </li>
          <li>
            <img src={insta} width="50" height="50" alt="instagram" />
          </li>
          <li>
            <img src={twit} alt="twitter" />
          </li>
        </ul>
      </div>
    </div>
  );
}

function Home() {
  return (
    <div className="home-container">
      <div className="main-content">
        <p>
          A trendy new place to eat all kinds of foods. The idea behind this
          restaurant came when we considered the possibility of serving all
          kinds of food without limiting it to a set of people. This is why we
          have multiple different menus for different type of people and their
          preferences. We wanted a place that included everyone. So here we are.
        </p>
        <br />
        <p>Some new paragraph.</p>
      </div>
      <div className="side-content">
        <img src={locat} alt="location" />
      </div>
    </div>
  );
}

function App() {
  return <Main />;
}

export default App;
