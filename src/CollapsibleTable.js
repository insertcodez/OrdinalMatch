import * as React from "react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { visuallyHidden } from "@mui/utils";
import Toolbar from "@mui/material/Toolbar";
import TableSortLabel from "@mui/material/TableSortLabel";
import TablePagination from "@mui/material/TablePagination";
import { alpha } from "@mui/material/styles";
import "./CollapsibleTable.css";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import Skeleton from "@mui/material/Skeleton";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Grid, Typography } from "@mui/material";
import Divider from "@mui/material/Divider";
import Howitworks from "./Howitworks";


const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "rgba(255, 118, 17,0.9)",
    color: "black",
    fontWeight: 700,
    boxShadow: theme.shadows[1],
    fontSize: 13,
  },
}));

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "token_ID",
    numeric: false,
    disablePadding: false,
    label: "Token ID",
    hideSortLabel: false,
  },
  {
    id: "Status",
    numeric: false,
    disablePadding: false,
    label: "Status",
    hideSortLabel: false,
  },
  {
    id: "inscription",
    numeric: true,
    disablePadding: false,
    label: "Inscription ID",
    hideSortLabel: false,
  },
  {
    id: "ordinalLength",
    numeric: true,
    disablePadding: false,
    label: "Inscriptions",
    hideSortLabel: false,
  },
  {
    id: "image_url",
    numeric: true,
    disablePadding: false,
    label: "Image",
    hideSortLabel: true,
  },
  {
    id: "Ordinal",
    numeric: true,
    disablePadding: false,
    label: "Ordinal",
    hideSortLabel: true,
  },
  {
    id: "Ordswap",
    numeric: true,
    disablePadding: false,
    label: "Ordswap",
    hideSortLabel: true,
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
    console.log(property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1rem", sm: "1rem" },
              lineHeight: "1.5",
              display: {
                xs:
                  headCell.id === "Ordswap" ||
                  headCell.id === "Ordinal" ||
                  headCell.id === "image_url" ||
                  headCell.id === "ordinalLength"
                    ? "none"
                    : "table-cell",
                sm:
                  headCell.id === "Ordswap" ||
                  headCell.id === "Ordinal" ||
                  headCell.id === "image_url"
                    ? "none"
                    : "table-cell",
                md: headCell.id === "Ordswap" ? "none" : "table-cell",
                lg: "table-cell",
                xl: "table-cell",
              },
            }}
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.hideSortLabel ? (
              headCell.label
            ) : (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            )}
          </TableCell>
        ))}
        <TableCell
          sx={{ display: { xs: "none", sm: "table-cell" } }}
          padding="checkbox"
        ></TableCell>
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
};

function EnhancedTableToolbar(props) {
  const {
    blockHeight,
    contractAddress,
    collectionName,
    loading,
    collectionSupply,
    totalInscribed,
  } = props;
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        borderRadius: "5px",
        border: "1px solid #FF7611",
        boxShadow: "0 0 10px #FF7611",
        bgcolor: (theme) =>
          alpha(
            theme.palette.primary.main,
            theme.palette.action.activatedOpacity
          ),
      }}
    >
      <Box
        sx={{ flex: "1 1 100%", my: "1rem", my: { xs: "0.5rem", sm: "1rem" } }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "1.5rem",
            lineHeight: "1.5",
            textAlign: "left",
          }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {loading ? (
            <Skeleton animation="wave" width="100%" height={35} />
          ) : (
            <>{collectionName}</>
          )}
        </Typography>
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: "1rem",
            lineHeight: "1.2",
            textAlign: "left",
            wordBreak: "break-Word",
          }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {loading ? (
            <Skeleton animation="wave" width="100%" height={20} />
          ) : (
            <>Contract Address : {contractAddress}</>
          )}
        </Typography>
        <LightTooltip title="This is the latest block the collection token was found." followCursor>
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: "1rem",
            lineHeight: "1.2",
            textAlign: "left",
            py: "0.3rem",
          }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {loading ? (
            <Skeleton animation="wave" width="100%" height={20} />
          ) : ( 
            <>Latest Block : {blockHeight}</>
          )}
        </Typography>
        </LightTooltip>
        <Grid container spacing={0}>
          <Grid item xs={6} sm={4} md={4} lg={3}>
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: "1rem",
                lineHeight: "1.2",
                textAlign: "left",
                py: "0.3rem",
              }}
              variant="h6"
              id="tableTitle"
              component="div"
            >
              {loading ? (
                <Skeleton animation="wave" width="100%" height={20} />
              ) : (
                <>Collection Supply : {collectionSupply}</>
              )}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={5} md={4} lg={3}>
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: "1rem",
                lineHeight: "1.2",
                textAlign: "left",
                py: "0.3rem",
              }}
              variant="h6"
              id="tableTitle"
              component="div"
            >
              {loading ? (
                <Skeleton animation="wave" width="100%" height={20} />
              ) : (
                <>Total Inscribed : {totalInscribed ? totalInscribed : 0}</>
              )}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Toolbar>
  );
}

function Row(props) {
  const { row, isOpen, onClick } = props;
  const ordinalLabels = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"];

  return (
    <React.Fragment>
      <TableRow
        className={row.ordinalmatch ? "unavailable-row" : "available-row"}
        sx={{ "& > *": { borderBottom: "unset", borderTop:"1px solid rgba(245, 245, 245, 0.2)", cursor: "pointer" } }}
        onClick={onClick}
      >
        <TableCell
          sx={{
            fontWeight: 500,
            lineHeight: "1.5",
            pr: "0",
            fontSize: { xs: "1rem", sm: "1rem" },
          }}
          align="left"
        >
          <LightTooltip title="Token ID" followCursor>
          <span>{row.token_id}</span>
          </LightTooltip>
        </TableCell>
        <TableCell
          sx={{
            fontWeight: 500,
            lineHeight: "1.5",
            pl: "1",
            fontSize: { xs: "1rem", sm: "1rem" },
          }}
          component="th"
          scope="row"
        >
          {row.ordinalmatch ? (
            <>
            <LightTooltip title="Status" followCursor>
              <span>Inscribed</span>
              </LightTooltip>
            </>
          ) : (
            <>
            <LightTooltip title="Status" followCursor>
              <span>Not Inscribed </span>
              </LightTooltip>
              <span
                sx={{ display: { xs: "none", sm: "inline-block" } }}
                className="dot"
              ></span>
              
            </>
          )}
        </TableCell>
        <TableCell
          sx={{
            fontWeight: 500,
            lineHeight: "1.5",
            fontSize: { xs: "1rem", sm: "1rem" },
          }}
          align="right"
        >
          <LightTooltip title="Inscription ID" followCursor>
          <span>{row.ordinalmatch ? row.ordinalmatch[0].id : "Not Inscribed"}</span>
          </LightTooltip>
        </TableCell>

        <TableCell
          sx={{
            fontWeight: 500,
            fontSize: { xs: "1rem", sm: "1rem" },
            lineHeight: "1.5",
            display: { xs: "none", sm: "table-cell" },
          }}
          align="right"
        >
          <LightTooltip title="Total Inscriptions" followCursor>
          <span>{row.ordinalmatch ? row.ordinalmatch.length : "0"}</span>
          </LightTooltip>
        </TableCell>
        <TableCell
          sx={{
            fontWeight: 500,
            fontSize: "1rem",
            lineHeight: "1.5",
            display: { xs: "none", sm: "none", md: "table-cell" },
          }}
          align="right"
        >
          {row.ordinalmatch ? (
            <LightTooltip title="View Collection Image" followCursor>
              <button
                type="button"
                onClick={() => window.open(row.image_url, "_blank")}
                style={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  color: "#FF7611",
                }}
              >
                <ImageOutlinedIcon />
              </button>
            </LightTooltip>
          ) : (
            <LightTooltip title="View Collection Image" followCursor>
              <button
                type="button"
                onClick={() => window.open(row.image_url, "_blank")}
                style={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  color: "rgb(173, 255, 47, 0.8)",
                }}
              >
                <ImageOutlinedIcon />
              </button>
            </LightTooltip>
          )}
        </TableCell>
        <TableCell
          sx={{
            fontWeight: 500,
            fontSize: "1rem",
            lineHeight: "1.5",
            display: { xs: "none", sm: "none", md: "table-cell" },
          }}
          align="right"
        >
          {row.ordinalmatch ? (
            <LightTooltip title="View At Ordinals.com" followCursor>
            <button
              type="button"
              onClick={() => window.open(row.ordinalmatch[0].url, "_blank")}
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
                color: "#FF7611",
              }}
            >
              <OpenInNewRoundedIcon />
            </button>
            </LightTooltip>
          ) : (
            <LightTooltip title="Not Inscribed" followCursor>
            <button
              style={{
                border: "none",
                background: "none",
                cursor: "default",
                color: "rgb(173, 255, 47, 0.8)",
              }}
            >
              <OpenInNewRoundedIcon />
            </button>
            </LightTooltip>
          )}
        </TableCell>
        <TableCell
          sx={{
            fontWeight: 500,
            fontSize: "1rem",
            lineHeight: "1.5",
            display: { xs: "none", sm: "none", md: "none", lg: "table-cell" },
          }}
          align="right"
        >
          {row.ordinalmatch ? (
            <LightTooltip title="View In Ordswap" followCursor>
            <button
              type="button"
              onClick={() =>
                window.open(
                  `https://ordswap.io/inscription/${row.ordinalmatch[0].url.split('/').slice(-1)}`,
                  "_blank"
                )
              }
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
                color: "#FF7611",
              }}
            >
              <OpenInNewRoundedIcon />
            </button>
            </LightTooltip>
          ) : (
            <LightTooltip title="Not Inscribed" followCursor>
            <button
              style={{
                border: "none",
                background: "none",
                cursor: "default",
                color: "rgb(173, 255, 47, 0.8)",
              }}
            >
              <OpenInNewRoundedIcon />
            </button>
            </LightTooltip>
          )}
        </TableCell>
        <TableCell
          sx={{
            fontWeight: 500,
            fontSize: "1rem",
            lineHeight: "1.5",
            display: {
              xs: "none",
              sm: "none",
              md: "none",
              lg: "none",
              xl: "table-cell",
            },
          }}
        >
          <IconButton aria-label="expand row" size="small" onClick={onClick}>
            {isOpen ? (
              <KeyboardArrowUpIcon style={{ color: "greenyellow" }} />
            ) : (
              <KeyboardArrowDownIcon style={{ color: "orange" }} />
            )}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow
      sx={{
        borderTop: isOpen && row.ordinalmatch ? "1px solid #FF7611" : isOpen && !row.ordinalmatch ? "1px solid #adff2f" : "",
        boxShadow: isOpen && row.ordinalmatch ? "0 0 30px #FF7611" : isOpen && !row.ordinalmatch ? "0 0 20px #adff2f" : "",
        }}
        
      >
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <Box sx={{ my: 1 }}>
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "1rem",
                  lineHeight: "1.2",
                  textAlign: "left",
                  wordBreak: "break-all",
                  
                }}
                variant="h6"
                id="tableTitle"
                component="div"
              >
                <Grid container spacing={0}>
          <Grid item xs={6} sm={3} md={3} lg={2}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "1rem",
                lineHeight: "1.2",
                textAlign: "left",
                py: "0.3rem",
                
              }}
              variant="h6"
              id="tableTitle"
              component="div"
            >
              
               Token ID <span style={{color: row.ordinalmatch ? "#FF7611" : "#adff2f"}}>#{row.token_id}</span>
              
            </Typography>
            </div>
          </Grid>
          <Grid item xs={5} sm={3} md={3} lg={3}>
          <div style={{ display: "flex", alignItems: "center" }}>
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: "1rem",
                      lineHeight: "1.2",
                      textAlign: "left",
                      wordBreak: "break-all",
                    }}
                  >
                    View Image:
                  </span>
                  {row.ordinalmatch ? (
                    <button
                      type="button"
                      onClick={() => window.open(row.image_url, "_blank")}
                      style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        color: "#FF7611",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <ImageOutlinedIcon />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => window.open(row.image_url, "_blank")}
                      style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        color: "#adff2f",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <ImageOutlinedIcon />
                    </button>
                  )}
                </div>
          </Grid>
        </Grid>
                
              </Typography>
              <Divider
                sx={{
                  backgroundColor: "#ffffff",
                  my: "0.3rem",
                  
                }}
              />
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "1rem",
                  lineHeight: "1.2",
                  textAlign: "left",
                  wordBreak: "break-word",
                  display: "flex",
                }}
                variant="h6"
                id="tableTitle"
                component="div"
              >
                Image Hash : {row.hashfield}
              </Typography>
              <Divider sx={{ backgroundColor: "#ffffff", my: "0.3rem" }} />
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "1rem",
                  lineHeight: "1.2",
                  textAlign: "left",
                  wordBreak: "break-all",
                  display: "flex",
                }}
                variant="h6"
                id="tableTitle"
                component="div"
              >
                Inscriptions :
              </Typography>
              <Table
                size="small"
                aria-label="inscriptions"
                sx={{
                  px: "0",
                  maxWidth: {
                    xs: "100vw",
                    sm: "70vw",
                    md: "60vw",
                    lg: "50vw",
                    xl: "50vw",
                  },
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontSize: "1rem",
                        fontWeight: "700",
                        px: "0",
                      }}
                    >
                      ID
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "1rem",
                        fontWeight: "700",
                        px: "0",
                      }}
                      
                    >
                      Position
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "1rem",
                        fontWeight: "700",
                        px: "0",
                      }}
                    >
                      Ordinal
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "1rem",
                        fontWeight: "700",
                        px: "0",
                      }}
                    >
                      Ordswap
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {row.ordinalmatch ? (
                    row.ordinalmatch.map((inscription, index) => (
                      <TableRow sx={{my:"0"}} key={inscription.id} >
                        <TableCell
                          component="th"
                          scope="row"
                          sx={{
                            fontSize: "1rem",
                            py: "0",
                            px: "0",
                            color: index === 0 && '#FF7611',
                            fontWeight: index === 0 ? '700' : '500',
                          }}
                        >
                          {inscription.id}
                        </TableCell>
                        <TableCell
                          component="th"
                          scope="row"
                          sx={{
                            fontSize: "1rem",
                            fontWeight: index === 0 ? '700' : '500',
                            
                            py: "0",
                            px: "0",
                            color: index === 0 && '#FF7611',
                          }}
                          align="left"
                        >
                          {ordinalLabels[index]} Inscription
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: "1rem",
                            px: "0",
                          }}
                          align="left"
                        >
                          <button
                            type="button"
                            onClick={() =>
                              window.open(inscription.url, "_blank")
                            }
                            style={{
                              border: "none",
                              background: "none",
                              cursor: "pointer",
                              color: "#FF7611",
                              px: "0",
                            }}
                          >
                            <OpenInNewRoundedIcon />
                          </button>
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: "1rem",
                            px: "0",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              window.open(
                                `https://ordswap.io/inscription/${row.ordinalmatch[index].url.split('/').slice(-1)}`,
                                "_blank"
                              )
                            }
                            style={{
                              border: "none",
                              background: "none",
                              cursor: "pointer",
                              color: "#FF7611",
                            }}
                          >
                            <OpenInNewRoundedIcon />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        sx={{
                          fontSize: "1rem",
                          px: "0",
                          color: "#adff2f"
                        }}
                        component="th"
                        scope="row"
                      >
                        -
                      </TableCell>

                      <TableCell
                        sx={{
                          fontSize: "1rem",
                          px: "0",
                          color: "#adff2f"
                        }}
                        align="left"
                      >
                        -
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "1rem",
                          px: "0",
                          color: "#adff2f"
                        }}
                      >
                        -
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "1rem",
                          px: "0",
                          color: "#adff2f"
                        }}
                      >
                        -
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function CollapsibleTable() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("token_ID");
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(100);
  const [jsonData, setJsonData] = useState([]);
  const [openRowIndex, setOpenRowIndex] = useState(-1);
  const [contractAddress, setContractAddress] = useState("");
  const [blockHeight, setBlockHeight] = useState(0);
  const [collectionName, setCollectionName] = useState("");
  const [sortedData, setSortedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [collection, setCollection] = useState("");
  const [collectionList, setCollectionList] = useState([]);
  const [token, setToken] = useState("");
  const [insId, setInsId] = useState("");
  const [searchedData, setSearchedData] = useState();
  const [collectionSupply, setCollectionSupply] = useState(0);
  const [totalInscribed, setTotalInscribed] = useState(0);

  const handleChangeInsId = (event) => {
    setInsId(event.target.value);
    setToken("");
  };

  const handleChangeToken = (event) => {
    setToken(event.target.value);
    setInsId("");
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      if (token == "") {
        handleSearchInscription();
      }
      else {
        handleSearch();
      }
    }
  };

  const handleButtonPress = () => {
      if (token == "") {
        handleSearchInscription();
      }
      else {
        handleSearch();
      }
    
  };

  const handleSearch = () => {
    if (openRowIndex !== -2) {
      handleRowClick(-2);
    }
    const searchData = jsonData.find(
      (obj) => obj.token_id === token.toString()
    );
    setSearchedData(searchData);
    console.log(searchData.token_id);
  };

  const handleSearchInscription = () => {
    if (openRowIndex !== -2) {
      handleRowClick(-2);
    }
    const searchData = jsonData.find((obj) => {
      if (obj.ordinalmatch) {
        for (let i = 0; i < obj.ordinalmatch.length; i++) {
          if (obj.ordinalmatch[i].id == insId) {
            return true;
          }
        }
      }
      return false;
    });
    setSearchedData(searchData);
    if (searchData) {
      console.log(searchData.ordinalmatch);
    } else {
      console.log("No match found");
    }
  };
  

  const rows = Array.from({ length: rowsPerPage }, (_, index) => ({
    id: index + 1,
    name: `Row ${index + 1}`,
  }));

  const handleChangePage = (event, newPage) => {
    setSearchedData(null);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - sortedData.length) : 0;

  const handleRowClick = (index) => {
    if (openRowIndex === index) {
      setOpenRowIndex(-1);
    } else {
      setOpenRowIndex(index);
    }
  };

  useEffect(() => {
    fetch('https://www.ordinalmatch.com/data/datalist.json')
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.dataFiles.map((filename) => {
          return {
            label: filename.replace(/_/g, " ").replace(".json", ""),
            value: filename,
          };
        });
        setCollectionList(formattedData);
        console.log(formattedData);
        console.log(formattedData);
        setCollection(formattedData[0]);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`https://www.ordinalmatch.com/data/${collection.value}`)
      .then((response) => response.json())
      .then((data) => {
        setJsonData(data.tokens);
        setSortedData(data.tokens);
        setLoading(false);
        setLoading(false);
        setCollectionName(data.collectionName);
        setContractAddress(data.contractAddress);
        setBlockHeight(data.blockheight);
        setCollectionSupply(data.collectionSupply);
        setTotalInscribed(data.totalInscribed);
      })
      .catch((error) => console.log(error));
  }, [collection]);

  const handleCollectionChange = (event, newValue) => {
    if (newValue != null) {
      setCollection(newValue);
      setSearchedData(null);
    }
  };

  const handleRequestSort = (event, property) => {
    setSearchedData(null);
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);

    if (property === "token_ID") {
      const sortData = jsonData.sort((a, b) => {
        if (isAsc) {
          return a[property] > b[property] ? 1 : -1;
        } else {
          return b[property] > a[property] ? 1 : -1;
        }
      });

      setSortedData(sortData);
    } else if (property === "ordinalLength") {
      const sortData = jsonData
        .filter((obj) => obj.hasOwnProperty("ordinalmatch"))
        .sort((a, b) =>
          isAsc
            ? a.ordinalmatch.length - b.ordinalmatch.length
            : b.ordinalmatch.length - a.ordinalmatch.length
        )
        .concat(jsonData.filter((obj) => !obj.hasOwnProperty("ordinalmatch")));

      setSortedData(sortData);
    } else if (property === "inscription") {
      const sortData = jsonData
        .filter((obj) => obj.hasOwnProperty("ordinalmatch"))
        .sort((a, b) =>
          isAsc
            ? a.ordinalmatch[0].id - b.ordinalmatch[0].id
            : b.ordinalmatch[0].id - a.ordinalmatch[0].id
        )
        .concat(jsonData.filter((obj) => !obj.hasOwnProperty("ordinalmatch")));

      setSortedData(sortData);
    } else if (property === "Status") {
      const sortData = [...jsonData].sort((a, b) => {
        const aHasOrdinalmatch = a.hasOwnProperty("ordinalmatch");
        const bHasOrdinalmatch = b.hasOwnProperty("ordinalmatch");

        if (aHasOrdinalmatch && !bHasOrdinalmatch) {
          return isAsc ? -1 : 1;
        } else if (!aHasOrdinalmatch && bHasOrdinalmatch) {
          return isAsc ? 1 : -1;
        } else {
          const indexA = jsonData.indexOf(a);
          const indexB = jsonData.indexOf(b);
          return isAsc ? indexA - indexB : indexB - indexA;
        }
      });
      setSortedData(sortData);
    }
  };

  return (
    <>
    
    <Box sx={{ width: "90%", maxWidth: "1080px", mb:"2rem" }}>
      
      <Box sx={{ flex: "1 1 100%", my: "1rem" }}>
        <Typography sx={{
      fontSize: {
        xs: "1.5rem",
        sm: "1.8rem",    
        md: "2.1rem",  
        lg: "2.3rem",    
        xl: "2.3rem", 
      }}}>
        Find Ethereum NFT Collections That Are Perfectly Inscribed As Ordinals Byte-to-Byte.
        </Typography>
      
        <p style={{fontSize:"1.5rem"}}></p>
      
      </Box>
      <Howitworks/>
      <div style={{ marginBottom: "1.2rem", display: "flex", alignItems: "center" }}>
      <Autocomplete
          sx={{
            
            "& .MuiAutocomplete-endAdornment .MuiSvgIcon-root": {
              color: "#FF7611",
            },
            "& .MuiAutocomplete-clearIndicator .MuiSvgIcon-root": {
              color: "#FF7611",
            },
            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              borderColor: "#FF7611",
              boxShadow: "0 0 10px 0 #FF7611",
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                borderColor: "rgba(173, 255, 47, 0.7)",
                boxShadow: "0 0 10px 0 greenyellow",
              },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
              color: "greenyellow",
            },
            "& .MuiInputLabel-outlined.Mui-focused": {
              color: "greenyellow",
            },
            "& .MuiOutlinedInput-input": {
              color: "##ffffff",
            },
            "& label.Mui-focused": {
              color: "rgba(173, 255, 47, 0.8)",
            },
            
            "& .MuiAutocomplete-option:hover": {
              backgroundColor: "#1e1e1e",
              transition: "background-color 0.3s ease",
              boxShadow: "0 0 20px 0 greenyellow",
            },
            "& .MuiAutocomplete-option:hover *": {
              color: "greenyellow",
              transition: "color 0.3s ease",
            },
          }}
          value={collection}
          onChange={handleCollectionChange}
          options={collectionList}
          getOptionLabel={(option) => option?.label || ""}
          PaperComponent={({ children }) => (
            <Paper
              sx={{
                backgroundColor: "#1D1E1F",
                transition: "background-color 0.3s ease",
                "&:hover": {
                  backgroundColor: "#181919",
                  transition: "background-color 0.3s ease",
                },
              }}
            >
              {children}
            </Paper>
          )}
          style={{ width: 300, marginRight: "1rem" }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Collection"
              variant="outlined"
              InputLabelProps={{
                sx: { color: "#FF7611" },
              }}
            />
          )}
        />
      </div>
      <div
        style={{ marginBottom: "2rem", display: "flex", alignItems: "center" }}
      >
        
        <TextField onKeyPress={handleKeyPress}
          sx={{
            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              borderColor: "#FF7611",
            },
            "& .MuiAutocomplete-endAdornment .MuiSvgIcon-root": {
              color: "#FF7611",
            },
            "& .MuiAutocomplete-clearIndicator .MuiSvgIcon-root": {
              color: "#FF7611",
            },
            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              borderColor: "#FF7611",
              boxShadow: "0 0 10px 0 #FF7611",
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                borderColor: "rgba(173, 255, 47, 0.7)",
                boxShadow: "0 0 10px 0 greenyellow",
              },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
              color: "greenyellow",
            },
            "& .MuiInputLabel-outlined.Mui-focused": {
              color: "greenyellow",
            },
            "& .MuiOutlinedInput-input": {
              color: "##ffffff",
            },
            "& label.Mui-focused": {
              color: "rgba(173, 255, 47, 0.8)",
            },

            "& .MuiAutocomplete-paper li.MuiAutocomplete-option.Mui-focusVisible, & .MuiAutocomplete-paper li.MuiAutocomplete-option:hover":
              {
                backgroundColor: "#ff7611",
              },
          }}
          label="Search Token ID"
          value={token}
          onChange={handleChangeToken}
          style={{ marginRight: "1rem" }}
        />
        <TextField onKeyPress={handleKeyPress}
          sx={{
            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              borderColor: "#FF7611",
            },
            "& .MuiAutocomplete-endAdornment .MuiSvgIcon-root": {
              color: "#FF7611",
            },
            "& .MuiAutocomplete-clearIndicator .MuiSvgIcon-root": {
              color: "#FF7611",
            },
            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              borderColor: "#FF7611",
              boxShadow: "0 0 10px 0 #FF7611",
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                borderColor: "rgba(173, 255, 47, 0.7)",
                boxShadow: "0 0 10px 0 greenyellow",
              },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
              color: "greenyellow",
            },
            "& .MuiInputLabel-outlined.Mui-focused": {
              color: "greenyellow",
            },
            "& .MuiOutlinedInput-input": {
              color: "##ffffff",
            },
            "& label.Mui-focused": {
              color: "rgba(173, 255, 47, 0.8)",
            },

            "& .MuiAutocomplete-paper li.MuiAutocomplete-option.Mui-focusVisible, & .MuiAutocomplete-paper li.MuiAutocomplete-option:hover":
              {
                backgroundColor: "#ff7611",
              },
          }}
          label="Search Inscription ID"
          value={insId}
          onChange={handleChangeInsId}
          style={{ marginRight: "1rem" }}
        />
        <Button variant="contained" color="primary" onClick={handleButtonPress} sx={{
          '&:hover': {
            backgroundColor: '#FF7611',
            color: '#1A2027',
          },
        }}>
          Search
        </Button>
      </div>

      <Paper
        sx={{
          width: "100%",
          mb: 2,
          borderRadius: "10px",
          border: "1px solid #FF7611",
          boxShadow: "0 0 10px #FF7611",
        }}
      >
        <EnhancedTableToolbar
          loading={loading}
          blockHeight={blockHeight}
          collectionName={collectionName}
          contractAddress={contractAddress}
          collectionSupply={collectionSupply}
          totalInscribed={totalInscribed}
        />
        <TableContainer component={Paper}>
          <Table
            sx={{
              [`& .${tableCellClasses.root}`]: {
                borderBottom: "none",
              },
            }}
            aria-label="collapsible table"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />

            <TableBody>
              {loading ? (
                rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <Skeleton animation="wave" height={35} width="100%" />
                    </TableCell>
                    <TableCell>
                      <Skeleton height={35} width="100%" />
                    </TableCell>
                    <TableCell>
                      <Skeleton height={35} width="100%" />
                    </TableCell>
                    <TableCell>
                      <Skeleton
                        height={35}
                        sx={{ display: { xs: "none", sm: "flex", md: "flex" } }}
                      />
                    </TableCell>
                    <TableCell>
                      <Skeleton
                        height={35}
                        sx={{ display: { xs: "none", sm: "none", md: "flex" } }}
                      />
                    </TableCell>
                    <TableCell>
                      <Skeleton
                        height={35}
                        sx={{ display: { xs: "none", sm: "none", md: "flex" } }}
                      />
                    </TableCell>
                    <TableCell>
                      <Skeleton
                        height={35}
                        sx={{
                          display: {
                            xs: "none",
                            sm: "none",
                            md: "none",
                            lg: "flex",
                          },
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <>
                  {searchedData && (
                    <Row
                      key={searchedData.token_id}
                      row={searchedData}
                      isOpen={openRowIndex === -2}
                      onClick={() => handleRowClick(-2)}
                    />
                  )}
                  {stableSort(sortedData, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((data, index) => {
                      return (
                        <Row
                          key={data.token_id}
                          row={data}
                          isOpen={openRowIndex === index}
                          onClick={() => handleRowClick(index)}
                        />
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow
                      style={{
                        height: (dense ? 33 : 53) * emptyRows,
                      }}
                    >
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[100, 150, 200]}
          component="div"
          count={sortedData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      
    </Box>
    </>
  );
}
