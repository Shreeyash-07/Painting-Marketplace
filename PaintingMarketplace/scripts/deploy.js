async function main() {
  const Painting = await ethers.getContractFactory("PaintingMarketplace");
  const paintingContract = await Painting.deploy();

  await paintingContract.deployed();

  console.log("PaintingMarketplace deployed to:", paintingContract.address);
}
//0x7CE4E062Bc45617E504f592bb4eAed8f96de9E19
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit = 1;
  });
