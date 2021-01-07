using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Core.Entities;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data
{
    public class StoreContextSeed
    {
        public static async Task SeedAsync(StoreContext context, ILoggerFactory loggerFactory )
        {
            try
            {
                if(!context.ProductBrands.Any())
                {
                    var brandData=File.ReadAllText("../Infrastructure/Data/SeedData/brands.json");
                    var brand = JsonSerializer.Deserialize<List<ProductBrand>>(brandData);
                    foreach(var item in brand)
                    {
                        context.ProductBrands.Add(item);
                    }
                    await context.SaveChangesAsync();
                }
                if(!context.ProductTypes.Any())
                {
                    var typeData=File.ReadAllText("../Infrastructure/Data/SeedData/types.json");
                    var type = JsonSerializer.Deserialize<List<ProductType>>(typeData);
                    foreach(var item in type)
                    {
                        context.ProductTypes.Add(item);
                    }
                    await context.SaveChangesAsync();
                }
                if(!context.Products.Any())
                {
                    var productData=File.ReadAllText("../Infrastructure/Data/SeedData/products.json");
                    var product = JsonSerializer.Deserialize<List<Product>>(productData);
                    foreach(var item in product)
                    {
                        context.Products.Add(item);
                    }
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                var logger=loggerFactory.CreateLogger<StoreContextSeed>();
                logger.LogError(ex.Message);
            }
        }
    }
}