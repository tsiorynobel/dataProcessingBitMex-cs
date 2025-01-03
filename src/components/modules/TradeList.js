/*
* preparer un composant -> affiche liste des trades ligne 24-40
* Math.ceil :calcule dynamiquement le nombre de pages nécessaires pour afficher toutes les transactions,
 en arrondissant le résultat
*/
import React, { useEffect, useState } from "react";
import TradeService from "../../services/TradeService";
import "./TradeList.css";
 

const formatDateToFrench = (isoDate) => {

  const date = new Date(isoDate);
  return new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);

};


const TradeList = () => {

  const [,setTrades] = useState([]);
  const [filteredTrades, setFilteredTrades] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
 
  useEffect(() => {

    TradeService.fetchTrades()
      .then((data) => {
        setTrades(data);
        setFilteredTrades(data);
      })

      .catch((error) => console.error("Erreur lors du fetch :", error));

  }, []);
 
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTrades.slice(indexOfFirstItem, indexOfLastItem);
 
  const totalPages = Math.ceil(filteredTrades.length / itemsPerPage);
 
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
 
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
 
  const calculateTradeStats = () => {
    if (filteredTrades.length === 0) {
      return {
        max: 0,
        maxDate: "",
        min: 0,
        minDate: "",
        avg: 0,
        profitability: 0,
        startDate: "",
        endDate: "",
      };
    }
 
    const prices = filteredTrades.map((trade) => trade.price);
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    const avgPrice = (prices.reduce((sum, price) => sum + price, 0) / prices.length).toFixed(2);
 
    const maxPriceTrade = filteredTrades.find((trade) => trade.price === maxPrice);
    const minPriceTrade = filteredTrades.find((trade) => trade.price === minPrice);
 
    const profitability = ((prices[prices.length - 1] - prices[0]) / prices[0]) * 100;
 
    const startDate = formatDateToFrench(filteredTrades[0]?.timestamp || "");
    const endDate = formatDateToFrench(
      filteredTrades[filteredTrades.length - 1]?.timestamp || ""
    );
 
    return {
      max: maxPrice.toFixed(2),
      maxDate: formatDateToFrench(maxPriceTrade.timestamp),
      min: minPrice.toFixed(2),
      minDate: formatDateToFrench(minPriceTrade.timestamp),
      avg: avgPrice,
      profitability: profitability.toFixed(2),
      startDate,
      endDate,
    };
  };
 
  const { max, maxDate, min, minDate, avg, profitability, startDate, endDate } =
    calculateTradeStats();
 
  return (
<div className="trade-list-container">
      {}
<div className="trade-summary">
<h2>Résumé des Trades</h2>
<p>
          Prix maximum : <strong>{max}</strong>
<span> | Date : <strong>{maxDate}</strong> </span>
</p>
<p>
          Prix minimum : <strong>{min}</strong>
<span> | Date : <strong> {minDate} </strong> </span>
</p>
<p>
          Prix moyen : <strong>{avg}</strong>
<span> | Date : <strong>{startDate}</strong> <strong>jusqu'au {endDate}</strong></span>
</p>
<p>Rentabilité : <strong>{profitability}%</strong></p>
</div>
 

<div className="trade-list">
<h2 className="title">Liste des Trades</h2>
<table className="trades-table">
<thead>
<tr className="trade-item">
<th>Timestamp</th>
<th>Symbole</th>
<th>Prix</th>
</tr>
</thead>
<tbody>
            {currentItems.map((trade) => (
<tr key={trade.id} className="trade-item">
<td className="timestamp">{formatDateToFrench(trade.timestamp)}</td>
<td className="symbol">{trade.symbol}</td>
<td className="price">{trade.price}</td>
</tr>
            ))}
</tbody>
</table>
 
<div className="pagination">
<button
            className="page-button"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
>
            Précédent
</button>
<span className="page-info">
            Page {currentPage} sur {totalPages}
</span>
<button
            className="page-button"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
>
            Suivant
</button>
</div>
</div>
</div>
  );
};
 
export default TradeList;