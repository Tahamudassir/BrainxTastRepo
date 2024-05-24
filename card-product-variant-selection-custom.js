document.addEventListener('DOMContentLoaded', function() {
    var productGrids = document.querySelectorAll('.grid.product-grid');

    productGrids.forEach(function(productGrid) {
        var sectionId = productGrid.getAttribute('data-section-id');
        var variantDataMap = window['variantDataMap' + sectionId.replace(/-/g, '_')];

        if (!variantDataMap) {
            console.error(`No variant data map found for section ID: ${sectionId}`);
            return;
        }

        productGrid.addEventListener('change', function(e) {
            if (e.target.matches('input[type="radio"][data-section-id="' + sectionId + '"]')) {
                var card = e.target.closest(`.card-product-custom-div[data-section-id="${sectionId}"]`);
                var variantId = e.target.getAttribute('data-variant-id');
                var variantData = variantDataMap[variantId];

                console.log('Variant Data:', variantData);

                if (!variantData) {
                    console.log('No data found for variant:', variantId);
                    return;
                }

                // Update the product image with lazy loading logic
                var productImageElement = card.querySelector('.card__media img');
                if (productImageElement) {
                    var lazyLoadAllVariants = card.getAttribute('data-lazy-load-all-variants') === 'true';
                    if (lazyLoadAllVariants) {
                        var preloadedImage = card.querySelector(`img[data-variant-id="${variantId}"]`);
                        if (preloadedImage) {
                            productImageElement.src = preloadedImage.src;
                            productImageElement.srcset = preloadedImage.srcset;
                        } else {
                            console.log('Matching preloaded image not found for variant:', variantId);
                        }
                    } else {
                        // Update src and srcset for responsive images
                        var dynamicSrcset = [
                            variantData.imageUrl + '?width=165 165w',
                            variantData.imageUrl + '?width=360 360w',
                            variantData.imageUrl + '?width=533 533w',
                            variantData.imageUrl + '?width=720 720w',
                            variantData.imageUrl + '?width=940 940w',
                            variantData.imageUrl + '?width=1066 1066w'
                        ].join(', ');
                        productImageElement.srcset = dynamicSrcset;
                        productImageElement.src = variantData.imageUrl;
                    }
                } else {
                    console.log('No product image element found in this card.');
                }

                // Update the product URL
                var productLinks = card.querySelectorAll('a[id^="CardLink-"], a[id^="StandardCardNoMediaLink-"]');
                productLinks.forEach(function(link) {
                    link.href = variantData.productUrl;
                });

                // Update the product Price
                var productPrice = card.querySelector('.card-information .price-item--regular'); // Adjust selector based on your price element
                if (productPrice) {
                    console.log('Updating price to:', variantData.price);
                    productPrice.textContent = variantData.price;
                } else {
                    console.log('Price element not found.');
                }

            } else {
                console.log('Change detected, but not on a swatch.');
            }
        });

    });

});
