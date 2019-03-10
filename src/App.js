import React, { Component } from "react";
import axios from "axios";

// Components
import Sidebar from "./Sidebar";
import AuthorsList from "./AuthorsList";
import AuthorDetail from "./AuthorDetail";
import Loading from "./Loading";
class App extends Component {
  state = {
    currentAuthor: null,
    filteredAuthors: [],
    authors: [],
    loading: true,
    error: null
  };

  //`/https://the-index-api.herokuapp.com/api/authors/${author.id}/`

  selectAuthor = async author => {
    this.setState({ loading: true });
    try {
      const authorResponse = await axios.get(
        `https://the-index-api.herokuapp.com/api/authors/${author.id}/`
      );
      let dataFromAuthorResponse = authorResponse.data;
      this.setState({ currentAuthor: dataFromAuthorResponse, loading: false });
    } catch (error) {
      console.error("something went wrong");
      console.error(error);
      this.setState({ error: error });
    }
  };

  unselectAuthor = () => this.setState({ currentAuthor: null });

  filterAuthors = query => {
    query = query.toLowerCase();
    let filteredAuthors = this.state.authors.filter(author => {
      return `${author.first_name} ${author.last_name}`
        .toLowerCase()
        .includes(query);
    });
    this.setState({ filteredAuthors: filteredAuthors });
  };

  getContentView = () => {
    if (this.state.currentAuthor) {
      return <AuthorDetail author={this.state.currentAuthor} />;
    } else {
      return (
        <AuthorsList
          authors={this.state.filteredAuthors}
          selectAuthor={this.selectAuthor}
          filterAuthors={this.filterAuthors}
        />
      );
    }
  };

  componentDidMount() {
    this.getAuthorsAndBooks();
  }

  getAuthorsAndBooks = async () => {
    try {
      const authorsResponse = await axios.get(
        "https://the-index-api.herokuapp.com/api/authors/"
      );
      const booksAndAuthors = authorsResponse.data;
      console.log(booksAndAuthors);
      this.setState({
        authors: booksAndAuthors,
        filteredAuthors: booksAndAuthors,
        loading: false
      });
    } catch (error) {
      console.error("something went wrong");
      console.error(error);
      this.setState({ error: error });
    }
  };

  render() {
    if (this.state.error) return <div>Wrong Wrong</div>;
    if (this.state.loading) return <Loading />;
    return (
      <div id="app" className="container-fluid">
        <div className="row">
          <div className="col-2">
            <Sidebar unselectAuthor={this.unselectAuthor} />
          </div>
          <div className="content col-10">{this.getContentView()}</div>
        </div>
      </div>
    );
  }
}

export default App;
